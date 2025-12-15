package com.trumio.lms.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.trumio.lms.dto.UserDTO;
import com.trumio.lms.dto.UserStatsDTO;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AdminUserService;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findByActiveTrue(pageable);
        return users.map(UserDTO::new);
    }

    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        user.setActive(false);
        userRepository.save(user);

        log.info("User deactivated: {}", userId);

        String performedBy = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogService.logAction("DEACTIVATE_USER", "User", userId, performedBy);

        // Notification
        notificationService.sendNotification(user, "Your account has been deactivated by an administrator.");
    }

    @Override
    public void reactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        user.setActive(true);
        userRepository.save(user);

        log.info("User reactivated: {}", userId);

        String performedBy = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogService.logAction("REACTIVATE_USER", "User", userId, performedBy);

        // Notification
        notificationService.sendNotification(user, "Your account has been reactivated by an administrator.");
    }

    @Override
    public UserStatsDTO getUserStats() {
        long totalUsers = userRepository.countTotalUsers();
        long totalAdmins = userRepository.countByRole_Name("ADMIN");
        long totalNormalUsers = userRepository.countByRole_Name("USER");

        return new UserStatsDTO(totalUsers, totalAdmins, totalNormalUsers);
    }
}