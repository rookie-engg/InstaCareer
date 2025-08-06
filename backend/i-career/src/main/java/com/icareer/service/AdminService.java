package com.icareer.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.icareer.entity.User;
import com.icareer.entity.UserRequest;
import com.icareer.repository.UserRepository;
import com.icareer.repository.UserRequestRepository;

@Service
public class AdminService {

	private final UserRepository userRepository;
	private final UserRequestRepository userRequestRepository;

	public AdminService(UserRepository userRepository, UserRequestRepository userRequestRepository) {
		this.userRepository = userRepository;
		this.userRequestRepository = userRequestRepository;
	}

	public List<User> getUsers() {
		return userRepository.findAll();
	}

	public User addUsers(User user) {
		if (user == null || user.getId() == null || user.getName() == null) {
			throw new IllegalArgumentException("User ID and Name cannot be null");
		}
		if (userRepository.existsById(user.getId())) {
			throw new IllegalArgumentException("User with ID " + user.getId() + " already exists");
		}
		return userRepository.save(user);
	}
    
    /**
     * ✅ NEW: Method to handle user update logic.
     *
     * @param userId      The ID of the user to update.
     * @param userDetails The new user data.
     * @return The updated User object.
     */
    public User updateUser(String userId, User userDetails) {
        User existingUser = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Update fields if they are provided in the request
        if (userDetails.getName() != null && !userDetails.getName().isEmpty()) {
            existingUser.setName(userDetails.getName());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().isEmpty()) {
            existingUser.setEmail(userDetails.getEmail());
        }
        // Note: Password updates should be handled with care, possibly in a separate, more secure endpoint.
        // For now, we are allowing name and email updates.

        return userRepository.save(existingUser);
    }

	public List<UserRequest> getUserHistory(String userId) {
		if (userId == null || userId.isEmpty()) {
			throw new IllegalArgumentException("User ID cannot be null or empty");
		}
		if (!userRepository.existsById(UUID.fromString(userId))) {
			throw new IllegalArgumentException("User with ID " + userId + " does not exist");
		}
		return userRequestRepository.findUserRequestsByUser_Id(UUID.fromString(userId));
	}

	public Boolean deleteUser(String userId) {
		if (userId == null || userId.isEmpty()) {
			throw new IllegalArgumentException("User ID cannot be null or empty");
		}
		if (!userRepository.existsById(UUID.fromString(userId))) {
			throw new IllegalArgumentException("User with ID " + userId + " does not exist");
		}
		userRepository.deleteById(UUID.fromString(userId));
		return true;
	}

	public Boolean deleteUserHistory(String historyId) {
		if (historyId == null || historyId.isEmpty()) {
			throw new IllegalArgumentException("History ID cannot be null or empty");
		}
		if (!userRequestRepository.existsById(UUID.fromString(historyId))) {
			throw new IllegalArgumentException("History with ID " + historyId + " does not exist");
		}
		userRequestRepository.deleteById(UUID.fromString(historyId));
		return true;
	}
}