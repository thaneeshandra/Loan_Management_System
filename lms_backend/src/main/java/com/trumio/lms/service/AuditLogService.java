package com.trumio.lms.service;

public interface AuditLogService {
    void logAction(String action, String entity, Long entityId, String performedBy);
}