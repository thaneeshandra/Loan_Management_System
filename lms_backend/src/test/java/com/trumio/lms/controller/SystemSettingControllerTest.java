package com.trumio.lms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trumio.lms.dto.SystemSettingDTO;
import com.trumio.lms.service.SystemSettingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SystemSettingController.class)
@AutoConfigureMockMvc(addFilters = false)
class SystemSettingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SystemSettingService settingService;

    @Autowired
    private ObjectMapper objectMapper;

    private SystemSettingDTO settingDTO;

    @BeforeEach
    void setUp() {
        settingDTO = new SystemSettingDTO();
        settingDTO.setKey("MAX_LOAN_AMOUNT");
        settingDTO.setValue("10000");
        settingDTO.setDescription("Maximum loan amount allowed");
    }

    @Test
    void testGetAllSettings() throws Exception {
        List<SystemSettingDTO> mockList = Collections.singletonList(settingDTO);
        when(settingService.getAllSettings()).thenReturn(mockList);

        mockMvc.perform(get("/api/settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].key").value("MAX_LOAN_AMOUNT"))
                .andExpect(jsonPath("$[0].value").value("10000"))
                .andExpect(jsonPath("$[0].description").value("Maximum loan amount allowed"));
    }

    @Test
    void testUpdateSetting() throws Exception {
        when(settingService.updateSetting(eq("MAX_LOAN_AMOUNT"), eq("10000"))).thenReturn(settingDTO);

        mockMvc.perform(put("/api/settings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(settingDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value("MAX_LOAN_AMOUNT"))
                .andExpect(jsonPath("$.value").value("10000"))
                .andExpect(jsonPath("$.description").value("Maximum loan amount allowed"));
    }
}