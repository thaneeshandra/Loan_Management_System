package com.trumio.lms.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import com.trumio.lms.dto.NotificationDTO;
import com.trumio.lms.entity.Notification;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.NotificationRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AuditLogService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @Mock private NotificationRepository notificationRepository;
    @Mock private UserRepository userRepository;
    @Mock private AuditLogService auditLogService;
    @Mock private Authentication authentication;

    private User user;

    @SuppressWarnings("unused")
    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
    }

    @Test
    void sendNotification_shouldSaveNotificationAndLogAction() {
        Notification savedNotification = new Notification();
        savedNotification.setId(10L);
        savedNotification.setUser(user);
        savedNotification.setMessage("Hello");

        when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);

        notificationService.sendNotification(user, "Hello");

        verify(notificationRepository).save(any(Notification.class));
        verify(auditLogService).logAction("SEND_NOTIFICATION", "Notification", null, "user@example.com");
    }

    @Test
    void getUserNotifications_whenUserExists_shouldReturnNotifications() {
        Pageable pageable = PageRequest.of(0, 5);
        Notification n = new Notification();
        n.setId(1L);
        n.setUser(user);
        n.setMessage("Test");
        n.setSentAt(LocalDateTime.now());

        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByUser(user, pageable)).thenReturn(new PageImpl<>(List.of(n)));

        Page<NotificationDTO> result = notificationService.getUserNotifications(false, authentication, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Test", result.getContent().get(0).getMessage());
    }

    @Test
    void getUserNotifications_whenUserNotFound_shouldThrowException() {
        when(authentication.getName()).thenReturn("ghost@example.com");
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
            notificationService.getUserNotifications(false, authentication, PageRequest.of(0, 5))
        );
    }

    @Test
    void markAsRead_whenUserOwnsNotification_shouldMarkReadAndLog() {
        Notification notification = new Notification();
        notification.setId(5L);
        notification.setUser(user);
        notification.setRead(false);

        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findById(5L)).thenReturn(Optional.of(notification));

        notificationService.markAsRead(5L, authentication);

        assertTrue(notification.isRead());
        verify(notificationRepository).save(notification);
        verify(auditLogService).logAction("MARK_NOTIFICATION_READ", "Notification", 5L, "user@example.com");
    }

    @Test
    void markAsRead_whenNotificationBelongsToAnotherUser_shouldThrowSecurityException() {
        User other = new User();
        other.setId(99L);

        Notification notification = new Notification();
        notification.setId(5L);
        notification.setUser(other);

        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findById(5L)).thenReturn(Optional.of(notification));

        assertThrows(SecurityException.class, () ->
            notificationService.markAsRead(5L, authentication)
        );
    }

    @Test
    void markAllAsRead_whenUserExists_shouldMarkUnreadNotifications() {
        Notification unread = new Notification();
        unread.setId(1L);
        unread.setUser(user);
        unread.setRead(false);

        Notification alreadyRead = new Notification();
        alreadyRead.setId(2L);
        alreadyRead.setUser(user);
        alreadyRead.setRead(true);

        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(notificationRepository.findByUser(user, Pageable.unpaged())).thenReturn(new PageImpl<>(List.of(unread, alreadyRead)));

        notificationService.markAllAsRead(authentication);

        verify(notificationRepository).save(unread);
        verify(notificationRepository, never()).save(alreadyRead);
        verify(auditLogService).logAction("MARK_ALL_NOTIFICATIONS_READ", "Notification", null, "user@example.com");
    }
}