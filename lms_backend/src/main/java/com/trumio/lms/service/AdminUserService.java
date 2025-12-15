package com.trumio.lms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.trumio.lms.dto.UserDTO;
import com.trumio.lms.dto.UserStatsDTO;

public interface AdminUserService {

    Page<UserDTO> getAllUsers(Pageable pageable);

    void deactivateUser(Long userId);

    void reactivateUser(Long userId);

    UserStatsDTO getUserStats();
}