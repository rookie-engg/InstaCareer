package com.icareer.entity;

import java.time.Instant;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

/**
 * Entity class for the 'user_responses' table.
 * Represents the final response data for a user request.
 *
 * This entity has a one-to-one relationship with UserRequest, sharing the
 * primary key.
 */
@Entity
@Table(name = "user_responses")
public class UserResponse {

    /**
     * Primary key for the user_responses table.
     * This ID is a foreign key that maps to the primary key of the UserRequest table,
     * enforcing the one-to-one relationship.
     * The @MapsId annotation indicates that this is a shared primary key.
     */
//    @Id
//    @Column(columnDefinition = "BINARY(16)")
//    private UUID id;

	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id;
	
    /**
     * Defines the one-to-one relationship with the UserRequest entity.
     * @MapsId indicates that the primary key of this entity is also a foreign key.
     * @JoinColumn specifies the foreign key column.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private UserRequest userRequest;

    /**
     * The final response data from Kafka, stored as JSON in the database.
     * The 'columnDefinition' is set to 'JSON' for MySQL.
     */
    @Column(name = "response_data", columnDefinition = "JSON")
    private String responseData;

    /**
     * Timestamp of when the response was received.
     */
//    @Column(name = "response_timestamp", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
//    @Column(name = "response_timestamp", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")    
    @Column(name = "response_timestamp", 
    columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", 
    insertable = false, 
    updatable = false)
    private Instant responseTimestamp;
    
//    @PrePersist
//    protected void onCreate() {
//        this.responseTimestamp = Instant.now();
//    }
    
    @Version
    private Long version;
    
	public UserResponse() {
		super();
	}

//	public UserResponse(UUID id, UserRequest userRequest, String responseData, Instant responseTimestamp) {
		public UserResponse(UUID id, UserRequest userRequest, String responseData) {
		super();
		this.id = id;
		this.userRequest = userRequest;
		this.responseData = responseData;
//		this.responseTimestamp = responseTimestamp;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	@JsonIgnore
	public UserRequest getUserRequest() {
		return userRequest;
	}

	public void setUserRequest(UserRequest userRequest) {
		this.userRequest = userRequest;
	}

	public String getResponseData() {
		return responseData;
	}

	public void setResponseData(String responseData) {
		this.responseData = responseData;
	}

	public Instant getResponseTimestamp() {
		return responseTimestamp;
	}

	public void setResponseTimestamp(Instant responseTimestamp) {
		this.responseTimestamp = responseTimestamp;
	}
}