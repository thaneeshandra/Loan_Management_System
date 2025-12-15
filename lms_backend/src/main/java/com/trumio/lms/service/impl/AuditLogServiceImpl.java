package com.trumio.lms.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trumio.lms.entity.AuditLog;
import com.trumio.lms.repository.AuditLogRepository;
import com.trumio.lms.service.AuditLogService;

@Service
public class AuditLogServiceImpl implements AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public void logAction(String action, String entity, Long entityId, String performedBy) {
        AuditLog log = new AuditLog(null, action, entity, entityId, performedBy, LocalDateTime.now());
        auditLogRepository.save(log);
    }


}