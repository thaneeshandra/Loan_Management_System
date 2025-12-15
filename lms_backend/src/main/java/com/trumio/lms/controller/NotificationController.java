package com.trumio.lms.controller;
 
import com.trumio.lms.dto.NotificationDTO;
import com.trumio.lms.service.NotificationService;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
 
    @Autowired
    private NotificationService notificationService;
 
    /**
     *  Get notifications for logged-in user (optionally filter by read/unread)
     */
    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getUserNotifications(
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDTO> result = notificationService.getUserNotifications(isRead, authentication, pageable);
        return ResponseEntity.ok(result);
    }
 
    /**
     *  Mark a specific notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        notificationService.markAsRead(id, authentication);
        return ResponseEntity.ok().build();
    }
 
    /**
     *  Mark all notifications as read
     */
    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication);
        return ResponseEntity.ok().build();
    }
 
}