package com.icareer.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.icareer.entity.TempUser;
//import com.icareer.repository.TempUserRepository;

/*
@RestController
public class TempUserController {
	@Autowired
	TempUserRepository userRepository;

	@GetMapping("/test")
	public String getRequest() {
		System.out.println("getRequest called");
		return "test";
	}
	
	@GetMapping("/login/{id}")
	public Optional<TempUser> login(@PathVariable String id) {
		System.out.println("login called : " + id);
		return userRepository.findById(id);
	}

	@PostMapping("/register")
	public TempUser register(@RequestBody TempUser user) {
		System.out.println(user + "hello");
		return userRepository.saveAndFlush(user);
	}
	
}
*/