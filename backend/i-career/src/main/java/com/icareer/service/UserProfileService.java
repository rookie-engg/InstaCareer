package com.icareer.service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.icareer.dto.UserProfileKafkaPayload;
import com.icareer.dto.UserProfileRequest;
import com.icareer.entity.RequestStatus;
import com.icareer.entity.UserRequest;
import com.icareer.entity.UserResponse;
import com.icareer.repository.UserRequestRepository;
import com.icareer.repository.UserResponseRepository;
import com.icareer.service.UserProfileStatusService.UserProfileStatus;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserProfileService {
	
	@Autowired
	private UserProfileStatusService userProfileStatusService;
	
	@Autowired
	UserRequestRepository userRequestRepository;
	
	@Autowired
	UserResponseRepository userResponseRepository;

	private static final Logger logger = LoggerFactory.getLogger(UserProfileService.class);

	// use a database (like Redis, PostgreSQL, etc.).
	private final Map<String, UserProfileKafkaPayload> processedProfiles = new ConcurrentHashMap<>();

	public void processAndStoreProfile(UserProfileKafkaPayload userProfileData) {
		String correlatedId = userProfileData.getId();
		UUID responseId = UUID.fromString(correlatedId);
		
		logger.info("Processing profile for correlatedId : {}", correlatedId);
		logger.info("Processing profile for correlatedId : {}", userProfileData.getRaw_descritions());
		logger.info("Processing profile for correlatedId : {}", userProfileData.getCleaned_descriptions());
		logger.info("Processing profile for correlatedId : {}", userProfileData.getModel_promt());
		logger.info("Processing profile for correlatedId : {}", userProfileData.getModel_res());
		
		Optional<UserRequest> optUserRequest = userRequestRepository.findById(responseId);
		if (optUserRequest.isEmpty()) {
			logger.error("UserRequest not found for correlatedId : {}", correlatedId);
			return;
		}

		UserRequest userRequest = optUserRequest.get();	
		
		if(userProfileData.getModel_res() == null || userProfileData.getModel_res().getError() != null) {
			logger.warn("UserProfileRequest is null for correlatedId : {}", correlatedId);
			userProfileStatusService.setStatus(correlatedId, UserProfileStatus.FAILED);
					
			userRequest.setStatus(RequestStatus.FAILED);
			userRequestRepository.save(userRequest);
			
			return;
		}
		
		userProfileStatusService.setStatus(correlatedId, UserProfileStatus.COMPLETED);
		
		userRequest.setStatus(RequestStatus.COMPLETED);
		userRequestRepository.save(userRequest);
		
		processedProfiles.put(correlatedId, userProfileData);
		
		//(UUID id, UserRequest userRequest, String responseData)
		/*
		 * userResponseRepository.saveAndFlush( new UserResponse(
		 * UUID.fromString(correlatedId), userRequest, userProfileData.toJson() ) );
		 */
		
		Optional<UserResponse> existingResponse = userResponseRepository.findById(responseId);
	    if (existingResponse.isPresent()) {
	        UserResponse userResponse = existingResponse.get();
	        userResponse.setUserRequest(userRequest); 
	        userResponse.setResponseData(userProfileData.toJson());
	        
	        userRequest.setUserResponse(userResponse);
//	        userResponseRepository.save(userResponse);
	        userRequestRepository.save(userRequest);
	        logger.info("Updated existing UserResponse for correlatedId: {}", correlatedId);
	    } else {
//	        userResponseRepository.save(new UserResponse(
	    	userRequest.setUserResponse(new UserResponse(
	            responseId,
	            userRequest,
	            userProfileData.toJson()
	        ));
	    	userRequestRepository.save(userRequest);
	        logger.info("Created new UserResponse for correlatedId: {}", correlatedId);
	    }
		
		logger.info("Stored processed profile for correlatedId with status {} : {}", userProfileStatusService.getStatus(correlatedId).get(),correlatedId);
	}

	public Optional<UserProfileRequest> getProcessedProfile(String correlatedId) {
		return Optional.ofNullable(processedProfiles.get(correlatedId)).map(UserProfileKafkaPayload::getModel_res);
	}
	
	public Optional<UserProfileKafkaPayload> getUserProfileKafkaPayload(String correlatedId) {
		return Optional.ofNullable(processedProfiles.get(correlatedId));
	}	

}