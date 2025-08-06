package com.icareer.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.icareer.utility.AppConstant;

@Component
public class KafkaConsumerService {

    @KafkaListener(topics = AppConstant.MY_TOPIC, groupId = AppConstant.USER_GROUP)
    public void consumeMessage(String message) {
        System.out.println("Message received: " + message);
    }
}