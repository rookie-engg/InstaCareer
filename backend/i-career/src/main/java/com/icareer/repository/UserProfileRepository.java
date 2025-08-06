package com.icareer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icareer.entity.UserProfile;

/**
 * Repository interface for UserProfile entities.
 * This interface extends JpaRepository, providing standard CRUD operations
 * for the UserProfile entity, which stores the user's profile data as a JSON string.
 *
 * The first generic parameter (UserProfile) specifies the entity type this repository manages.
 * The second generic parameter (Long) specifies the type of the entity's primary key.
 
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    // JpaRepository provides methods like save(), findById(), findAll(), delete(), etc.
    // You can add custom query methods here if needed, for example:
    // UserProfile findBySomeProperty(String someProperty);
}
*/