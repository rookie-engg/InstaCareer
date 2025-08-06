package com.icareer.entity;

import java.util.UUID;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

//@Entity
//@Table(name = "client")
//user is reserved keyword so we must use "user" instead of user (i.e, use double quotes with user), so we used escape character to achieve so
@Table(name = "\"user\"")
public class TempUser {
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Column(name = "id")
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "UUID")
	String uid;

	@Column(name = "u_name")
	String uName;

	@Column(name = "password")
	String password;
	
	/*
	 * @PrePersist public void generateId() { if (this.uid == null) this.uid =
	 * UUID.randomUUID().toString(); System.out.println(this); }
	 */
	
	public TempUser() {
		super();
	}

	public TempUser(String uid, String uName, String password) {
		super();
		this.uid = uid;
		this.uName = uName;
		this.password = password;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getuName() {
		return uName;
	}

	public void setuName(String uName) {
		this.uName = uName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "User [uid=" + uid + ", uName=" + uName + ", password=" + password + "]";
	}
}