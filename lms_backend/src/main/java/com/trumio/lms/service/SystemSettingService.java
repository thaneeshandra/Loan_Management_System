package com.trumio.lms.service;
 
import java.util.List;
 
import com.trumio.lms.dto.SystemSettingDTO;
 
public interface SystemSettingService {
    List<SystemSettingDTO> getAllSettings();
    SystemSettingDTO updateSetting(String key, String value);
 
    // New method to get a setting value directly
    String getSettingValue(String key);
 
    // New method with default fallback
    String getSettingValueOrDefault(String key, String defaultValue);
}