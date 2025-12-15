package com.trumio.lms.controller;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trumio.lms.dto.UserDTO;
import com.trumio.lms.dto.UserStatsDTO;
import com.trumio.lms.service.AdminUserService;

import lombok.extern.slf4j.Slf4j;
 
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminUserController {
 
    @Autowired
    private AdminUserService adminUserService;
 
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
    log.info("Admin fetching all users - Page: {}, Size: {}", page, size);
        return ResponseEntity.ok(adminUserService.getAllUsers(pageable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        adminUserService.deactivateUser(id);
    log.info("Admin deactivated user: {}", id);
        return ResponseEntity.ok("User deactivated successfully.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<String> reactivateUser(@PathVariable Long id) {
        adminUserService.reactivateUser(id);
    log.info("Admin reactivated user: {}", id);
        return ResponseEntity.ok("User reactivated successfully.");
    }


    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats() {
        return ResponseEntity.ok(adminUserService.getUserStats());
    }
}