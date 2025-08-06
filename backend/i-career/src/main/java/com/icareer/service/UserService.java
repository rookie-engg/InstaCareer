package com.icareer.service;

import org.springframework.http.ResponseEntity;

import com.icareer.entity.User;
import com.icareer.exception.InstaCareerException;

public interface UserService {

	public ResponseEntity<String> login(String email, String password) throws InstaCareerException;

	public User register(User user) throws InstaCareerException;

	public Boolean deleteUser(String id);

	public User updateUser(User user, String id) throws InstaCareerException;

}