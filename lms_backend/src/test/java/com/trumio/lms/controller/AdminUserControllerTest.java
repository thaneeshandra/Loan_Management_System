package com.trumio.lms.controller;

import com.trumio.lms.dto.UserStatsDTO;
import com.trumio.lms.service.AdminUserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminUserController.class)
class AdminUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminUserService adminUserService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetUserStats() throws Exception {
        UserStatsDTO mockStats = new UserStatsDTO(100, 15, 85);

        Mockito.when(adminUserService.getUserStats()).thenReturn(mockStats);

        mockMvc.perform(get("/api/admin/users/stats")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(100))
                .andExpect(jsonPath("$.totalAdmins").value(15))
                .andExpect(jsonPath("$.totalNormalUsers").value(85));
    }
}