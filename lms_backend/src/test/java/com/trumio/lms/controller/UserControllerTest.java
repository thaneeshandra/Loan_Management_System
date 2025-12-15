package com.trumio.lms.controller;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.trumio.lms.dto.UserDTO;
import com.trumio.lms.dto.UserProfileDTO;
import com.trumio.lms.dto.UserUpdateDTO;
import com.trumio.lms.service.AdminUserService;
import com.trumio.lms.service.UserService;

public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private AdminUserService adminUserService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    @InjectMocks
    private AdminUserController adminUserController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetProfile() {
        // Arrange
        UserProfileDTO profile = new UserProfileDTO();
        profile.setName("Test User");
        profile.setEmail("test@example.com");
        profile.setAddress("Hyderabad");

        when(userService.getProfile(authentication)).thenReturn(profile);

        // Act
        ResponseEntity<UserProfileDTO> response = userController.getProfile(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(profile, response.getBody());
        verify(userService, times(1)).getProfile(authentication);
    }

    @Test
    public void testUpdateProfile() {
        // Arrange
        UserUpdateDTO updateDTO = new UserUpdateDTO();
        updateDTO.setName("Updated User");
        updateDTO.setAddress("New Address");

        UserProfileDTO updatedProfile = new UserProfileDTO();
        updatedProfile.setName("Updated User");
        updatedProfile.setAddress("New Address");
        updatedProfile.setEmail("test@example.com");

        when(userService.updateProfile(updateDTO, authentication)).thenReturn(updatedProfile);

        // Act
        ResponseEntity<UserProfileDTO> response = userController.updateProfile(updateDTO, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedProfile, response.getBody());
        verify(userService, times(1)).updateProfile(updateDTO, authentication);
    }

    @Test
    public void testGetAllUsers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        UserDTO user1 = new UserDTO();
        user1.setId(1L);
        user1.setName("User One");
        user1.setEmail("one@example.com");

        UserDTO user2 = new UserDTO();
        user2.setId(2L);
        user2.setName("User Two");
        user2.setEmail("two@example.com");

        List<UserDTO> users = Arrays.asList(user1, user2);
        Page<UserDTO> userPage = new PageImpl<>(users, pageable, users.size());

        when(adminUserService.getAllUsers(pageable)).thenReturn(userPage);

        // Act
        ResponseEntity<Page<UserDTO>> response = adminUserController.getAllUsers(0, 10);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userPage, response.getBody());
        verify(adminUserService, times(1)).getAllUsers(pageable);
    }
}
