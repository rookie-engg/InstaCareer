package com.icareer.controller;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserProfileController {
//    @Autowired
//    private UserProfileRepository userProfileRepository; 
   
    /*
    @PostMapping("/save-profile")
    public ResponseEntity<String> saveUserProfile(@RequestBody Map<String, Object> userProfileData) {
        try {
            String jsonString = objectMapper.writeValueAsString(userProfileData);

            UserProfile userProfile = new UserProfile();
            userProfile.setProfileJson(jsonString);

            userProfileRepository.save(userProfile);

            return ResponseEntity.ok("User profile saved successfully!");

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing JSON: " + e.getMessage());
        }
    }
*/

}