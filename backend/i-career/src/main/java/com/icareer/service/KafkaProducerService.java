package com.icareer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${kafka.youtube-activity.topic:youtube-request-activity}")
    private String youtubeActivityTopic;
    
    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("Message sent: " + message + " to topic: " + topic);
    }

    public void send(String message) {
        sendMessage(youtubeActivityTopic, message);
    }
}