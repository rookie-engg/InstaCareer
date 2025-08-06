package com.icareer.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icareer.entity.UserResponse;

@Repository
public interface UserResponseRepository extends JpaRepository<UserResponse, UUID> {

}
