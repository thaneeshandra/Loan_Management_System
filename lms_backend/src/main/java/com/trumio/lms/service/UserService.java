package com.trumio.lms.service;

import org.springframework.security.core.Authentication;

import com.trumio.lms.dto.UserProfileDTO;
import com.trumio.lms.dto.UserUpdateDTO;

public interface UserService {

    UserProfileDTO getProfile(Authentication authentication);

    UserProfileDTO updateProfile(UserUpdateDTO updateDTO, Authentication authentication);

}
