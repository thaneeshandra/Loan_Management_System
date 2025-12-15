package com.trumio.lms.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trumio.lms.dto.SystemSettingDTO;
import com.trumio.lms.service.SystemSettingService;

@RestController
@RequestMapping("/api/settings")
@PreAuthorize("hasRole('ADMIN')")
public class SystemSettingController {
    @Autowired private SystemSettingService settingService;
 
    @GetMapping
    public ResponseEntity<List<SystemSettingDTO>> getAllSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }
 
    // Update a single setting
    @PutMapping
    public ResponseEntity<SystemSettingDTO> updateSetting(@RequestBody SystemSettingDTO dto) {
        return ResponseEntity.ok(settingService.updateSetting(dto.getKey(), dto.getValue()));
    }
    
    // Add a batch update method to handle multiple settings at once
    @PutMapping("/batch")
    public ResponseEntity<List<SystemSettingDTO>> updateBatchSettings(@RequestBody List<SystemSettingDTO> settings) {
        List<SystemSettingDTO> updated = new ArrayList<>();
        for (SystemSettingDTO setting : settings) {
            updated.add(settingService.updateSetting(setting.getKey(), setting.getValue()));
        }
        return ResponseEntity.ok(updated);
    }
}