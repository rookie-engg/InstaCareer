package com.icareer.controller;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.icareer.entity.RequestStatus;
import com.icareer.entity.User;
import com.icareer.entity.UserRequest;
import com.icareer.exception.ErrorMessage;
import com.icareer.exception.InstaCareerException;
import com.icareer.repository.UserRepository;
import com.icareer.service.FileUploadService;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

	@Autowired
	FileUploadService fileUploadService;
	
	@Autowired
	UserRepository userRepository;

	@PostMapping("/uploadZip")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<String> handleZipUpload(@RequestParam("file") MultipartFile file)
	        throws InstaCareerException {

	    if (file.isEmpty()) {
	        throw new InstaCareerException(new ErrorMessage(HttpStatus.BAD_REQUEST.value(), "File is empty"));
	    }

	    if (file.getOriginalFilename() == null || !file.getOriginalFilename().endsWith(".zip")) {
	        return ResponseEntity.badRequest().body("Uploaded file must have a .zip extension.");
	    }

	    try {
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        String userEmail = authentication.getName();

	        Optional<User> existingUser = userRepository.findByEmail(userEmail);
	        if (existingUser.isEmpty()) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
	        }

	        UserRequest userRequest = new UserRequest();
	        userRequest.setId(UUID.randomUUID());
	        userRequest.setUser(existingUser.get());
	        userRequest.setZipFileName(file.getOriginalFilename());
	        userRequest.setStatus(RequestStatus.RECEIVED);

	        fileUploadService.handleZipUpload(userRequest, file);
	        return ResponseEntity.ok(userRequest.getId().toString());
	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed.");
	    }
	}	
	
	/*
	@PostMapping("/uploadZip")
	public ResponseEntity<String> handleZipUpload(@RequestParam("file") MultipartFile file)
			throws InstaCareerException {
//		if (file.isEmpty() || !file.getOriginalFilename().endsWith(".zip") || file.getContentType() == null || !file.getContentType().equals("application/zip")) {
//			return ResponseEntity.badRequest().body("Please upload a valid ZIP file.");
//		}

		if (file.isEmpty()) {
			ErrorMessage errorDetail = new ErrorMessage(HttpStatus.BAD_REQUEST.value(),
					"Uploaded file is null or empty");
			throw new InstaCareerException(errorDetail);
//            return ResponseEntity.badRequest().body("Uploaded file is empty.");
		}

		if (file.getOriginalFilename() == null || !file.getOriginalFilename().endsWith(".zip")) {
			return ResponseEntity.badRequest().body("Uploaded file must have a .zip extension.");
		}

		if (file.getContentType() == null) {
			return ResponseEntity.badRequest().body("Content type is missing.");
		}

		if (!file.getContentType().equals("application/zip")
				&& !file.getContentType().equals("application/x-zip-compressed")) {
			return ResponseEntity.badRequest().body("Invalid content type. Expected application/zip.");
		}

		try {
			UUID correlatedId = UUID.randomUUID();
			
			UserRequest userRequest = new UserRequest();
			userRequest.setId(correlatedId);
			//TODO need to set user here, for now just using a new User object
			//Replace with real user (e.g., from security context)
			
			UUID uuid = UUID.randomUUID();
			
//			User user = new User();
////			user.setId(uuid);
//			user.setEmail(uuid.toString() + "@example.com"); 
//			user.setPassword(uuid.toString()); 
//			user.setName("Default User"); 
//			userRepository.saveAndFlush(user);
			
//			userRequest.setUser(user); // This should be replaced with the actual user object from the security context or request
			
			
			// If you have a user email from the request, you can fetch the user from the repository
			Optional<User> existingUser = userRepository.findByEmail("sahushivam1504@gmail.com");
			if (existingUser.isPresent()) {
			    userRequest.setUser(existingUser.get());
//			    userRequestRepository.save(userRequest);
			} else {
			    // or throw error / register new user first
			}

			
//			UserResponse userResponse = new UserResponse();
//			userResponse.setId(correlatedId); // matches UserRequest
//			userResponse.setUserRequest(userRequest); // establish backward link
//			userRequest.setUserResponse(userResponse); // optional, but keeps it bidirectional

			userRequest.setZipFileName(file.getOriginalFilename());
			userRequest.setStatus(RequestStatus.RECEIVED);
			
//			fileUploadService.getUserRequestRepository().save(userRequest);
			fileUploadService.handleZipUpload(userRequest, file);
			
			return ResponseEntity.ok(correlatedId.toString());
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed.");
		}
	}
	*/
	
}