package com.icareer.entity;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

/**
 * Entity class for the 'users' table.
 * Represents a user in the system.
 *
 * This entity has a one-to-many relationship with UserRequest.
 */
@Entity
@Table(name = "users")
public class User {

    /**
     * Primary key for the users table.
     * Maps to a UUID in the database. The 'uuid2' strategy is used
     * to generate a UUID that is suitable for use as a primary key.
     */
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    @Column(name = "id", columnDefinition = "UUID")
    private UUID id;       

    /**
     * The name of the user. Cannot be null.
     */
    @Column(nullable = false)
    private String name;

    /**
     * The email of the user. Must be unique and not null.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * The hashed password of the user. Cannot be null.
     */
    @Column(name = "password", nullable = false)
    private String password;
        
//    @Column(name = "created_at")
//    private Instant createdAt;
//
//    @Column(name = "updated_at")
//    private Instant updatedAt;
    
    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Instant createdAt;

    //entity.setRequestTimestamp(Instant.now());
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Instant updatedAt;

    /**
     * Timestamp of when the user was created. Defaults to the current time in the database.
     */
//    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
//    private Instant createdAt;

    /**
     * Timestamp of when the user was last updated. Defaults to the current time in the database.
     */
//    @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
//    private Instant updatedAt;

    /**
     * A list of requests made by this user.
     * Defines the one-to-many relationship with UserRequest.
     * 'mappedBy' indicates that the 'user' field in the UserRequest entity is the owning side of the relationship.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserRequest> userRequests;
    
    public enum Role {
        USER,
        ADMIN
    }

    @Column(name = "role", nullable = false)
    private Role role;
    
    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }
    
    /*
    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
    */
    
    @Version
    private Long version;
    
    public User() {
		super();
	}

	public User(UUID id, String name, String email, String password, Instant createdAt, Instant updatedAt,
			List<UserRequest> userRequests, Role role) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.userRequests = userRequests;
		this.role = role;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	@JsonIgnore
	public List<UserRequest> getUserRequests() {
		return userRequests;
	}

	public void setUserRequests(List<UserRequest> userRequests) {
		this.userRequests = userRequests;
	}

	public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
