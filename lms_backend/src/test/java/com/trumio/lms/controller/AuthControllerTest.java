package com.trumio.lms.controller;

import com.trumio.lms.dto.LoginRequestDTO;
import com.trumio.lms.dto.LoginResponseDTO;
import com.trumio.lms.dto.UserRegistrationDTO;
import com.trumio.lms.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegister_Success() {
        UserRegistrationDTO registrationDTO = new UserRegistrationDTO();
        registrationDTO.setEmail("test@example.com");
        registrationDTO.setPassword("password123");
        registrationDTO.setName("Test User");

        doNothing().when(authService).register(registrationDTO);

        ResponseEntity<String> response = authController.register(registrationDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("User registered successfully!", response.getBody());
        verify(authService, times(1)).register(registrationDTO);
    }

    @Test
    public void testLogin_Success() {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setEmail("test@example.com");
        loginRequestDTO.setPassword("password123");

        LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
        loginResponseDTO.setToken("dummy-token");
        loginResponseDTO.setUserId(1L);
        loginResponseDTO.setName("Test User");
        loginResponseDTO.setEmail("test@example.com");
        loginResponseDTO.setRole("USER");

        when(authService.login(loginRequestDTO)).thenReturn(loginResponseDTO);

        ResponseEntity<LoginResponseDTO> response = authController.login(loginRequestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(loginResponseDTO, response.getBody());
        verify(authService, times(1)).login(loginRequestDTO);
    }
}
