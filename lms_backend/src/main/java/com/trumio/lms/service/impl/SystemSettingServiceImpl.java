package com.trumio.lms.service.impl;
 
import java.util.List;
import java.util.stream.Collectors;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.trumio.lms.dto.SystemSettingDTO;
import com.trumio.lms.entity.SystemSetting;
import com.trumio.lms.repository.SystemSettingRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.SystemSettingService;
 
@Service
public class SystemSettingServiceImpl implements SystemSettingService {
 
    @Autowired
    private SystemSettingRepository repository;
 
    @Autowired
    private AuditLogService auditLogService;
 
    @Override
    public List<SystemSettingDTO> getAllSettings() {
        return repository.findAll().stream()
            .map(s -> new SystemSettingDTO(s.getKey(), s.getValue(), s.getDescription()))
            .collect(Collectors.toList());
    }
 
    @Override
    public SystemSettingDTO updateSetting(String key, String value) {
        SystemSetting setting = repository.findByKey(key)
            .orElseThrow(() -> new RuntimeException("Setting not found"));
        setting.setValue(value);
        repository.save(setting);
        auditLogService.logAction("UPDATE_SETTING", "SystemSetting", setting.getId(), "Admin");
        return new SystemSettingDTO(setting.getKey(), setting.getValue(), setting.getDescription());
    }
 
    @Override
    public String getSettingValue(String key) {
        return repository.findByKey(key)
            .map(SystemSetting::getValue)
            .orElse(null);
    }
 
    @Override
    public String getSettingValueOrDefault(String key, String defaultValue) {
        return repository.findByKey(key)
            .map(SystemSetting::getValue)
            .orElse(defaultValue);
    }
}
 