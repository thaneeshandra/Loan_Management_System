package com.trumio.lms.service;

import com.trumio.lms.dto.NotificationDTO;
import com.trumio.lms.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

public interface NotificationService {
    // Get notification for the logged-in user
    Page<NotificationDTO> getUserNotifications(Boolean isRead, Authentication authentication, Pageable pageable);

    // Send notification to user
    void sendNotification(User user, String message);

    // Mark a notification as read
    void markAsRead(Long notificationId, Authentication authentication);

    // Optional: mark all as read for user
    void markAllAsRead(Authentication authentication);
}
