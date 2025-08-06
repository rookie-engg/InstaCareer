package com.icareer.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.icareer.dto.UserProfileRequest;
import com.icareer.entity.User;
import com.icareer.entity.UserRequest;
import com.icareer.exception.InstaCareerException;
import com.icareer.repository.UserRepository;
import com.icareer.repository.UserRequestRepository;
import com.icareer.service.AdminService;
import com.icareer.service.UserProfileService;
import com.icareer.service.UserProfileStatusService;
import com.icareer.service.UserProfileStatusService.UserProfileStatus;
import com.icareer.service.UserService;

@RestController
public class UserController {
	private final UserService userService;
	private UserProfileStatusService userProfileStatusService; 	
	private final UserProfileService userProfileService;
    private final AdminService adminService;
    private final UserRepository userRepository; // ✅ For security check
    private final UserRequestRepository userRequestRepository; // ✅ For security check
    
	
	public UserController(UserService userService, UserProfileService userProfileService, UserProfileStatusService userProfileStatusService, AdminService adminService, UserRepository userRepository, UserRequestRepository userRequestRepository) {
		this.userService = userService;
		this.userProfileService = userProfileService;
		this.userProfileStatusService = userProfileStatusService;
        this.adminService = adminService;
        this.userRepository = userRepository;
        this.userRequestRepository = userRequestRepository;
	}

	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody JsonNode json) throws InstaCareerException {
	    String email = json.get("email").asText();
	    String password = json.get("password").asText();
	        
	    return userService.login(email, password);
	}

	@PostMapping("/register")
	public User register(@RequestBody User user) throws InstaCareerException {
		return userService.register(user);
	}

	@DeleteMapping("/delete/{id}")
	public <T> ResponseEntity<T> delete(@PathVariable String id) {
		return userService.deleteUser(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
	}

	@PatchMapping("/update/{id}")
	public User update(@RequestBody User user, @PathVariable String id) throws InstaCareerException {
		return userService.updateUser(user, id);
	}

    @GetMapping("/api/history/{userId}")
    public ResponseEntity<List<UserRequest>> getUserHistory(@PathVariable String userId) {
        List<UserRequest> history = adminService.getUserHistory(userId);
        return ResponseEntity.ok(history);
    }
	    
    @GetMapping("/api/profile/{correlatedId}")
    public ResponseEntity<UserProfileRequest> getProcessedProfile(@PathVariable String correlatedId) {
    	Optional<UserProfileStatus> profileStatus = userProfileStatusService.getStatus(correlatedId);
    	
    	if (profileStatus.isEmpty()) {
    		return ResponseEntity.badRequest().build();
    	}
    	
    	if (profileStatus.get().equals(UserProfileStatus.FAILED)) {
    		return ResponseEntity.internalServerError().build();
    	}
    	
    	if (profileStatus.get().equals(UserProfileStatus.PENDING)) {
    		return ResponseEntity.accepted().body(null);
    	}
    	
        Optional<UserProfileRequest> processedProfile = userProfileService.getProcessedProfile(correlatedId);

        return processedProfile
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ✅ NEW SECURE DELETE ENDPOINT
     * Allows a user to delete their OWN history record.
     */
    @DeleteMapping("/api/history/{historyId}")
    public ResponseEntity<Void> deleteUserHistory(@PathVariable String historyId) throws AccessDeniedException {
        // Get the email of the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        // Find the user from the database
        User currentUser = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));

        // Find the history item the user is trying to delete
        UserRequest historyItem = userRequestRepository.findById(UUID.fromString(historyId))
            .orElseThrow(() -> new RuntimeException("History item not found"));

        // SECURITY CHECK: Ensure the history item belongs to the currently logged-in user
        if (!historyItem.getUser().getId().equals(currentUser.getId())) {
            // If not, deny access. This prevents one user from deleting another's data.
            throw new AccessDeniedException("You do not have permission to delete this resource.");
        }

        // If the check passes, proceed with deletion
        adminService.deleteUserHistory(historyId);
        return ResponseEntity.noContent().build(); // Return 204 No Content on successful deletion
    }
}