package com.icareer.entity;

import java.time.Instant;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * Entity class for the 'user_requests' table.
 * Represents a request made by a user.
 *
 * This entity has a many-to-one relationship with User and a one-to-one
 * relationship with UserResponse.
 */
@Entity
@Table(name = "user_requests")
public class UserRequest {

    /**
     * Primary key for the user_requests table.
     * This is a correlated ID that will also be used as the primary key
     * for the one-to-one related UserResponse table.
     */
//    @Id
//    @Column(columnDefinition = "BINARY(16)")
//    private UUID id;
    
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    /**
     * Defines the many-to-one relationship with the User entity.
     * The foreign key column is 'user_id'.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Timestamp of when the request was made.
     */
//    @Column(name = "request_timestamp", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
//    @Column(name = "request_timestamp", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
//    private Instant requestTimestamp;

    @Column(name = "request_timestamp", 
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", 
            insertable = false, 
            updatable = false)
    private Instant requestTimestamp;
    
    /**
     * Name of the associated zip file.
     */
    @Column(name = "zip_file_name")
    private String zipFileName;

    /**
     * Path to the associated zip file.
     */
    @Column(name = "zip_file_path", nullable = false)
    private String zipFilePath;

    /**
     * The status of the request.
     * The @Enumerated annotation tells JPA to store the enum as a String in the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    /**
     * Defines the one-to-one relationship with the UserResponse entity.
     * 'mappedBy' indicates that the 'userRequest' field in the UserResponse entity
     * is the owning side.
     */
    @OneToOne(mappedBy = "userRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserResponse userResponse;
    
    @PrePersist
    protected void onCreate() {
        this.requestTimestamp = Instant.now();
    }
    
    public UserRequest() {
		super();
	}

//	public UserRequest(UUID id, User user, Instant requestTimestamp, String zipFileName, String zipFilePath,
			public UserRequest(UUID id, User user, String zipFileName, String zipFilePath,
			RequestStatus status, UserResponse userResponse) {
		super();
		this.id = id;
		this.user = user;
//		this.requestTimestamp = requestTimestamp;
		this.zipFileName = zipFileName;
		this.zipFilePath = zipFilePath;
		this.status = status;
		this.userResponse = userResponse;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	@JsonIgnore
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Instant getRequestTimestamp() {
		return requestTimestamp;
	}

	public void setRequestTimestamp(Instant requestTimestamp) {
		this.requestTimestamp = requestTimestamp;
	}

	public String getZipFileName() {
		return zipFileName;
	}

	public void setZipFileName(String zipFileName) {
		this.zipFileName = zipFileName;
	}

	public String getZipFilePath() {
		return zipFilePath;
	}

	public void setZipFilePath(String zipFilePath) {
		this.zipFilePath = zipFilePath;
	}

	public RequestStatus getStatus() {
		return status;
	}

	public void setStatus(RequestStatus status) {
		this.status = status;
	}

	public UserResponse getUserResponse() {
		return userResponse;
	}

	public void setUserResponse(UserResponse userResponse) {
		this.userResponse = userResponse;
	}
}