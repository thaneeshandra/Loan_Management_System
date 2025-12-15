package com.trumio.lms.service;

import com.trumio.lms.dto.LoginRequestDTO;
import com.trumio.lms.dto.LoginResponseDTO;
import com.trumio.lms.dto.UserRegistrationDTO;

public interface AuthService {
    void register(UserRegistrationDTO dto);
    LoginResponseDTO login(LoginRequestDTO dto);
}
