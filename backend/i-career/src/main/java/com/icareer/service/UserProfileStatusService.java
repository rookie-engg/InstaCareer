package com.icareer.service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class UserProfileStatusService {
	public static enum UserProfileStatus {
		PENDING, COMPLETED, FAILED
	};
	
	private final Map<String, UserProfileStatus> userProfileStatusMap = new ConcurrentHashMap<String, UserProfileStatus>();
	
	public Optional<UserProfileStatus> getStatus(String correlatedId) {
		return Optional.ofNullable(userProfileStatusMap.get(correlatedId));
	}
	
	public void setStatus(String correlatedId, UserProfileStatus status) {
		userProfileStatusMap.put(correlatedId, status);
	}
}