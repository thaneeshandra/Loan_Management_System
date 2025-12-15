package com.trumio.lms.service.impl;
 
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.trumio.lms.dto.SystemSettingDTO;
import com.trumio.lms.entity.SystemSetting;
import com.trumio.lms.repository.SystemSettingRepository;
import com.trumio.lms.service.AuditLogService;
 
@ExtendWith(MockitoExtension.class)
class SystemSettingServiceImplTest {
 
    @Mock
    private SystemSettingRepository repository;
 
    @Mock
    private AuditLogService auditLogService;
 
    @InjectMocks
    private SystemSettingServiceImpl service;
 
    private SystemSetting setting;
 
    @SuppressWarnings("unused")
    @BeforeEach
    void setUp() {
        setting = new SystemSetting(1L, "MAX_LOAN_AMOUNT", "50000", null);
    }
 
    @Test
    void getAllSettings_shouldReturnListOfSystemSettingDTOs() {
        when(repository.findAll()).thenReturn(List.of(setting));
 
        List<SystemSettingDTO> result = service.getAllSettings();
 
        assertEquals(1, result.size());
        assertEquals("MAX_LOAN_AMOUNT", result.get(0).getKey());
        assertEquals("50000", result.get(0).getValue());
        verify(repository, times(1)).findAll();
    }
 
    @Test
    void updateSetting_whenKeyExists_shouldUpdateExistingValue() {
        when(repository.findByKey("MAX_LOAN_AMOUNT")).thenReturn(Optional.of(setting));
 
        SystemSettingDTO updated = service.updateSetting("MAX_LOAN_AMOUNT", "60000");
 
        assertEquals("60000", setting.getValue());
        assertEquals("MAX_LOAN_AMOUNT", updated.getKey());
        verify(repository).save(setting);
        verify(auditLogService).logAction(eq("UPDATE_SETTING"), eq("SystemSetting"), eq(1L), eq("Admin"));
    }
 
    @Test
    void updateSetting_whenKeyDoesNotExist_shouldThrowException() {
        when(repository.findByKey("UNKNOWN_KEY")).thenReturn(Optional.empty());
 
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
            service.updateSetting("UNKNOWN_KEY", "value")
        );
 
        assertEquals("Setting not found", exception.getMessage());
        verify(repository, never()).save(any());
    }
 
    @Test
    void getAllSettings_whenRepositoryIsEmpty_shouldReturnEmptyList() {
        when(repository.findAll()).thenReturn(List.of());
 
        List<SystemSettingDTO> result = service.getAllSettings();
 
        assertTrue(result.isEmpty());
        verify(repository).findAll();
    }
}