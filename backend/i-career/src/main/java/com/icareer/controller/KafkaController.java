package com.icareer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.icareer.service.KafkaProducerService;
import com.icareer.utility.AppConstant;

@RestController
public class KafkaController {
	private final KafkaProducerService producerService;

	public KafkaController(KafkaProducerService producerService) {
		this.producerService = producerService;
	}

	//http://localhost:8080/publish?message=HelloKafka
	@GetMapping("/publish")
	public String publishMessage(@RequestParam("message") String message) {
		producerService.sendMessage(AppConstant.MY_TOPIC, message);
		return "Message published: " + message;
	}
	
	@PostMapping("/publish")
	public String publishMessage(@RequestBody Object obj) {
		String message = obj.toString(); 
		producerService.sendMessage(AppConstant.MY_TOPIC, message);
		
		System.out.println("Published message: " + message);
		return "Message published";
		// return ResponseEntity.ok("Message published: " + message);
	}
}