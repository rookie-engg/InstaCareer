package com.icareer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob; // For @Lob to map to CLOB/LONGTEXT

//@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    // Option 1: For MySQL 5.7+ using native JSON type
//    @Column(columnDefinition = "JSON")
//    private String profileJson;

    // Option 2: For general use (H2, older MySQL, or if not using native JSON type)
    // @Column(length = 65535) // Specify length if not using @Lob or if default is too small
    // Use @Lob for CLOB/LONGTEXT    
    @Lob 
     private String profileJson;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProfileJson() {
        return profileJson;
    }

    public void setProfileJson(String profileJson) {
        this.profileJson = profileJson;
    }
}