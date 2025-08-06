package com.icareer.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icareer.dto.UserProfileKafkaPayload;
import com.icareer.entity.User;
import com.icareer.entity.UserRequest;
import com.icareer.service.AdminService;
import com.icareer.service.UserProfileService;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

	private final AdminService adminService;
	private final UserProfileService userProfileService;
	
	public AdminController(AdminService adminService, UserProfileService userProfileService) {
		this.adminService = adminService;
		this.userProfileService = userProfileService;
	}
	
	@GetMapping("/users")
	public List<User> getUsers() {
		return adminService.getUsers();
	}
	
	@PostMapping("/users")
	public User addUsers(User user) {
		return adminService.addUsers(user);
	}

    /**
     * ✅ NEW: Endpoint to update a user's information.
     *
     * @param userId The ID of the user to update.
     * @param user   The updated user data from the request body.
     * @return The updated user object.
     */
    @PutMapping("/users/{userId}")
    public User updateUser(@PathVariable String userId, @RequestBody User user) {
        return adminService.updateUser(userId, user);
    }
	
	@DeleteMapping("/users/{userId}")
	public Boolean deleteUser(@PathVariable String userId) {
		return adminService.deleteUser(userId);
	}
	
	@GetMapping("/history/{userId}")
	public List<UserRequest> getUserHistory(@PathVariable String userId) {
		return adminService.getUserHistory(userId);
	}
	
	@DeleteMapping("/history/{historyId}")
	public Boolean deleteUserHistory(@PathVariable String historyId) {
		return adminService.deleteUserHistory(historyId);
	}
	
    @GetMapping("/api/profile/UserProfileKafkaPayload/{correlatedId}")
    public ResponseEntity<UserProfileKafkaPayload> getUserProfileKafkaPayload(@PathVariable String correlatedId) {
    	Optional<UserProfileKafkaPayload> processedProfile = userProfileService.getUserProfileKafkaPayload(correlatedId);
    	
    	return processedProfile
    			.map(ResponseEntity::ok)
    			.orElse(ResponseEntity.notFound().build());
    }
}