package com.trumio.lms.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.trumio.lms.dto.UserProfileDTO;
import com.trumio.lms.dto.UserUpdateDTO;
import com.trumio.lms.entity.Role;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AuditLogService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.springframework.security.core.Authentication;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock private UserRepository userRepository;
    @Mock private AuditLogService auditLogService;
    @Mock private Authentication authentication;

    private User user;

    @SuppressWarnings("unused")
    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setName("USER");

        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setMobileNumber("1234567890");
        user.setAddress("Bangalore");
        user.setRole(role);
    }

    // === Positive ===

    @Test
    void getProfile_whenUserFound_shouldReturnUserProfileDTO() {
        when(authentication.getName()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        UserProfileDTO profile = userService.getProfile(authentication);

        assertEquals("Test User", profile.getName());
        assertEquals("test@example.com", profile.getEmail());
        assertEquals("USER", profile.getRole());
    }

    @Test
    void updateProfile_whenUserFound_shouldUpdateFieldsAndReturnDTO() {
        when(authentication.getName()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setName("Updated Name");
        dto.setMobileNumber("9876543210");
        dto.setAddress("Hyderabad");

        UserProfileDTO updated = userService.updateProfile(dto, authentication);

        assertEquals("Updated Name", updated.getName());
        assertEquals("9876543210", updated.getMobileNumber());
        assertEquals("Hyderabad", updated.getAddress());

        verify(userRepository).save(user);
        verify(auditLogService).logAction("UPDATE_PROFILE", "User", user.getId(), "test@example.com");
    }

    // === Negative ===

    @Test
    void getProfile_whenUserNotFound_shouldThrowUserNotFoundException() {
        when(authentication.getName()).thenReturn("ghost@example.com");
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getProfile(authentication));
    }

    @Test
    void updateProfile_whenUserNotFound_shouldThrowUserNotFoundException() {
        when(authentication.getName()).thenReturn("ghost@example.com");
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setName("Ghost");
        dto.setAddress("Nowhere");
        dto.setMobileNumber("0000000000");

        assertThrows(UserNotFoundException.class, () -> userService.updateProfile(dto, authentication));
    }
}