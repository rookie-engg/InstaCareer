package com.icareer.utility;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.icareer.dto.UserProfileKafkaPayload;
import com.icareer.service.UserProfileService;

@Component
public class KafkaProfileListener {

    private final UserProfileService userProfileService;

    public KafkaProfileListener(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @KafkaListener(topics = "youtube-response-activity", groupId = "user-group")
    public void listen(@Payload UserProfileKafkaPayload userProfileData) {
        System.out.println("Received data: " + userProfileData);
        userProfileService.processAndStoreProfile(userProfileData);
    }
}