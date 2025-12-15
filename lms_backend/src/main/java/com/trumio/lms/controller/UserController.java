package com.trumio.lms.controller;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trumio.lms.dto.UserProfileDTO;
import com.trumio.lms.dto.UserUpdateDTO;
import com.trumio.lms.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
 
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;
 
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
    log.info("Fetching profile for user: {}", authentication.getName());
        UserProfileDTO profile = userService.getProfile(authentication);
        return ResponseEntity.ok(profile);
    }
 
    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(@Valid @RequestBody UserUpdateDTO updateDTO, Authentication authentication) {
    log.info("Updating profile for user: {}", authentication.getName());
        UserProfileDTO updatedProfile = userService.updateProfile(updateDTO, authentication);
        return ResponseEntity.ok(updatedProfile);
    }
 
    
}
 