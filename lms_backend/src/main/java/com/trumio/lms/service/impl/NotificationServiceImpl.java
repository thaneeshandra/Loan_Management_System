package com.trumio.lms.service.impl;

import com.trumio.lms.dto.NotificationDTO;
import com.trumio.lms.entity.Notification;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.NotificationRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.NotificationService;
import com.trumio.lms.service.AuditLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    // Send notification to a user
    @Override
    public void sendNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setSentAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        // Optional audit logging
        auditLogService.logAction("SEND_NOTIFICATION", "Notification", notification.getId(), user.getEmail());
    }

    // Get all notifications for authenticated user
    @Override
    public Page<NotificationDTO> getUserNotifications(Boolean isRead, Authentication authentication, Pageable pageable) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + email));

        return notificationRepository.findByUser(user, pageable)
                .map(this::mapToDTO);
    }

    // Mark single notification as read
    @Override
    public void markAsRead(Long notificationId, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + email));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to modify this notification.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        auditLogService.logAction("MARK_NOTIFICATION_READ", "Notification", notification.getId(), user.getEmail());
    }

    // Optional: mark all notifications as read
    @Override
    public void markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + email));

        notificationRepository.findByUser(user, Pageable.unpaged()).forEach(n -> {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });

        auditLogService.logAction("MARK_ALL_NOTIFICATIONS_READ", "Notification", null, user.getEmail());
    }

    // Helper to map entity to DTO
    private NotificationDTO mapToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setTimestamp(notification.getSentAt());
        dto.setIsRead(notification.isRead());
        dto.setUserId(notification.getUser().getId());
        return dto;
    }
}