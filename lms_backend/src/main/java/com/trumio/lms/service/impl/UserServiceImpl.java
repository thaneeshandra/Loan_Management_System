package com.trumio.lms.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.trumio.lms.dto.UserProfileDTO;
import com.trumio.lms.dto.UserUpdateDTO;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public UserProfileDTO getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        return new UserProfileDTO(
                user.getName(), user.getEmail(),
                user.getMobileNumber(), user.getAddress(),
                user.getRole().getName());
    }

    @Override
    public UserProfileDTO updateProfile(UserUpdateDTO updateDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        user.setName(updateDTO.getName());
        user.setMobileNumber(updateDTO.getMobileNumber());
        user.setAddress(updateDTO.getAddress());

        userRepository.save(user);
        log.info("User profile updated: {}", email);

        auditLogService.logAction("UPDATE_PROFILE", "User", user.getId(), email);

        return new UserProfileDTO(
                user.getName(), user.getEmail(),
                user.getMobileNumber(), user.getAddress(),
                user.getRole().getName());
    }

   
}