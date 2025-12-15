package com.trumio.lms.controller;

import com.trumio.lms.dto.LoginRequestDTO;
import com.trumio.lms.dto.LoginResponseDTO;
import com.trumio.lms.dto.UserRegistrationDTO;
import com.trumio.lms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // User Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegistrationDTO registrationDTO) {
        authService.register(registrationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }

    // User Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginDTO) {
        LoginResponseDTO response = authService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
}