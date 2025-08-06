package com.icareer.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icareer.entity.User;
import com.icareer.entity.UserRequest;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

	List<UserRequest> findUserRequestsById(UUID userId);

	Optional<User> findByEmailAndPassword(String email, String password);
	
	Boolean existsByEmailAndPassword(String email, String password);

	Optional<User> findByEmail(String string);
	
}