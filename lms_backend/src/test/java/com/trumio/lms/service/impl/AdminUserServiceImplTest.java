package com.trumio.lms.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import com.trumio.lms.entity.User;
import com.trumio.lms.dto.UserDTO;
import com.trumio.lms.dto.UserStatsDTO;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceImplTest {

    @InjectMocks
    private AdminUserServiceImpl userService;

    @Mock private UserRepository userRepository;
    @Mock private AuditLogService auditLogService;
    @Mock private NotificationService notificationService;

    private User user;

    @SuppressWarnings("unused")
    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setActive(true);
    }

    @Test
    void getAllUsers_shouldReturnActiveUsers() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> page = new PageImpl<>(List.of(user));
        when(userRepository.findByActiveTrue(pageable)).thenReturn(page);

        Page<UserDTO> result = userService.getAllUsers(pageable);

        assertEquals(1, result.getTotalElements());
        verify(userRepository).findByActiveTrue(pageable);
    }

    @Test
    void deactivateUser_validUser_shouldDeactivateSaveAuditAndNotify() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        mockSecurityContext("admin@example.com");

        userService.deactivateUser(1L);

        assertFalse(user.isActive());
        verify(auditLogService).logAction("DEACTIVATE_USER", "User", 1L, "admin@example.com");
        verify(notificationService).sendNotification(eq(user), contains("deactivated"));
    }

    @Test
    void deactivateUser_invalidUser_shouldThrowException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.deactivateUser(99L));
        assertTrue(ex.getMessage().contains("User not found"));
    }

    @Test
    void reactivateUser_validUser_shouldActivateSaveAuditAndNotify() {
        user.setActive(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        mockSecurityContext("admin@example.com");

        userService.reactivateUser(1L);

        assertTrue(user.isActive());
        verify(auditLogService).logAction("REACTIVATE_USER", "User", 1L, "admin@example.com");
        verify(notificationService).sendNotification(eq(user), contains("reactivated"));
    }

    @Test
    void reactivateUser_invalidUser_shouldThrowException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.reactivateUser(99L));
        assertTrue(ex.getMessage().contains("User not found"));
    }

    @Test
    void getUserStats_shouldReturnCorrectCounts() {
        when(userRepository.countTotalUsers()).thenReturn(100L);
        when(userRepository.countByRole_Name("ADMIN")).thenReturn(10L);
        when(userRepository.countByRole_Name("USER")).thenReturn(90L);

        UserStatsDTO result = userService.getUserStats();

        assertEquals(100, result.getTotalUsers());
        assertEquals(10, result.getTotalAdmins());
        assertEquals(90, result.getTotalNormalUsers());
    }

    // Helper to mock security context
    private void mockSecurityContext(String username) {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(username);

        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);

        SecurityContextHolder.setContext(context);
    }
}