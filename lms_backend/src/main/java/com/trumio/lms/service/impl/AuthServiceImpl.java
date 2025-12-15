package com.trumio.lms.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.trumio.lms.dto.LoginRequestDTO;
import com.trumio.lms.dto.LoginResponseDTO;
import com.trumio.lms.dto.UserRegistrationDTO;
import com.trumio.lms.entity.Role;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.InvalidCredentialsException;
import com.trumio.lms.exception.RoleNotFoundException;
import com.trumio.lms.exception.UserAlreadyExistsException;
import com.trumio.lms.repository.RoleRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.security.JwtTokenProvider;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.AuthService;
import com.trumio.lms.service.NotificationService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public void register(UserRegistrationDTO dto) {
        Optional<User> existing = userRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            throw new UserAlreadyExistsException("User already exists with email: " + dto.getEmail());
        }

        String roleName = (dto.getRole() == null || dto.getRole().isBlank()) ? "USER" : dto.getRole().toUpperCase();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RoleNotFoundException("Role not found: " + roleName));

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setMobileNumber(dto.getMobileNumber());
        user.setAddress(dto.getAddress());
        user.setRole(role);

        userRepository.save(user);

        // Audit log
        auditLogService.logAction("REGISTER", "User", user.getId(), user.getEmail());

        // Notification
        notificationService.sendNotification(user, "Welcome! Your account has been successfully registered.");
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
        Optional<User> optionalUser = userRepository.findByEmail(dto.getEmail());

        if (optionalUser.isEmpty()) {
            // Audit log for failed login
            auditLogService.logAction("LOGIN_FAILED", "Auth", null, dto.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            // Audit log for failed login
            auditLogService.logAction("LOGIN_FAILED", "Auth", user.getId(), dto.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Audit log for successful login
        auditLogService.logAction("LOGIN_SUCCESS", "Auth", user.getId(), user.getEmail());

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().getName());

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getName());

        return response;
    }
}