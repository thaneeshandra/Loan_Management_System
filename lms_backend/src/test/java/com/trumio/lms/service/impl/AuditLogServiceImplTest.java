package com.trumio.lms.service.impl;

import com.trumio.lms.entity.AuditLog;
import com.trumio.lms.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.mockito.Mockito.*;

class AuditLogServiceImplTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogServiceImpl auditLogService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogAction() {
        // Arrange
        String action = "APPROVE_DOCUMENT";
        String entity = "Document";
        Long entityId = 123L;
        String performedBy = "ADMIN";

        // Act
        auditLogService.logAction(action, entity, entityId, performedBy);

        // Assert
        verify(auditLogRepository, times(1)).save(argThat(log ->
                log.getAction().equals(action) &&
                log.getEntity().equals(entity) &&
                log.getEntityId().equals(entityId) &&
                log.getPerformedBy().equals(performedBy) &&
                log.getTimestamp() != null
        ));
    }
}