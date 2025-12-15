package com.trumio.lms.controller;

import com.trumio.lms.dto.NotificationDTO;
import com.trumio.lms.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    private NotificationDTO sampleNotification;

    @BeforeEach
    void setUp() {
        sampleNotification = new NotificationDTO();
        sampleNotification.setId(1L);
        sampleNotification.setMessage("Test notification");
        sampleNotification.setIsRead(false); // Correct setter method
        sampleNotification.setTimestamp(LocalDateTime.now());
        sampleNotification.setUserId(42L);
    }

    @Test
    void testGetUserNotifications() throws Exception {
        Page<NotificationDTO> mockPage = new PageImpl<>(Collections.singletonList(sampleNotification));
        when(notificationService.getUserNotifications(any(), any(), any()))
                .thenReturn(mockPage);

        mockMvc.perform(get("/api/notifications")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].message").value("Test notification"));
    }

    @Test
    void testMarkAsRead() throws Exception {
        doNothing().when(notificationService).markAsRead(eq(1L), any());

        mockMvc.perform(put("/api/notifications/1/read"))
                .andExpect(status().isOk());
    }

    @Test
    void testMarkAllAsRead() throws Exception {
        doNothing().when(notificationService).markAllAsRead(any());

        mockMvc.perform(put("/api/notifications/mark-all-read"))
                .andExpect(status().isOk());
    }
}