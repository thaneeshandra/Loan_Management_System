package com.trumio.lms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trumio.lms.dto.LoanReportDTO;
import com.trumio.lms.service.ReportingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LoanReportController.class)
@AutoConfigureMockMvc(addFilters = false)
class LoanReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportingService reportingService;

    private LoanReportDTO mockReport;

    @BeforeEach
    void setUp() {
        mockReport = new LoanReportDTO();
        mockReport.setLoanId(1L);
        mockReport.setUserName("John Doe");
        mockReport.setAmount(5000.0);
        mockReport.setStatus("APPROVED");
    }

    @Test
    void testGetLoanReport_DefaultParams() throws Exception {
        Pageable pageable = PageRequest.of(0, 10);
        Page<LoanReportDTO> mockPage = new PageImpl<>(Collections.singletonList(mockReport));

        when(reportingService.generateLoanReport(null, "id", "asc", pageable)).thenReturn(mockPage);

        mockMvc.perform(get("/api/admin/reports/loans")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].loanId").value(1))
                .andExpect(jsonPath("$.content[0].userName").value("John Doe"))
                .andExpect(jsonPath("$.content[0].amount").value(5000.0))
                .andExpect(jsonPath("$.content[0].status").value("APPROVED"));

        verify(reportingService, times(1)).generateLoanReport(null, "id", "asc", pageable);
    }

    @Test
    void testGetLoanReport_WithParams() throws Exception {
        Pageable pageable = PageRequest.of(1, 5);
        Page<LoanReportDTO> mockPage = new PageImpl<>(Collections.singletonList(mockReport));

        when(reportingService.generateLoanReport("APPROVED", "amount", "desc", pageable)).thenReturn(mockPage);

        mockMvc.perform(get("/api/admin/reports/loans")
                        .param("status", "APPROVED")
                        .param("sortBy", "amount")
                        .param("order", "desc")
                        .param("page", "1")
                        .param("size", "5")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].loanId").value(1))
                .andExpect(jsonPath("$.content[0].userName").value("John Doe"))
                .andExpect(jsonPath("$.content[0].amount").value(5000.0))
                .andExpect(jsonPath("$.content[0].status").value("APPROVED"));

        verify(reportingService, times(1)).generateLoanReport("APPROVED", "amount", "desc", pageable);
    }
}