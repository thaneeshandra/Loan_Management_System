package com.trumio.lms.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trumio.lms.dto.LoanApplicationDTO;
import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.service.LoanService;

@WebMvcTest(LoanController.class)
@AutoConfigureMockMvc(addFilters = false)
public class LoanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LoanService loanService;

    @Autowired
    private ObjectMapper objectMapper;

    private LoanDTO getMockLoanDTO() {
        LoanDTO dto = new LoanDTO();
        dto.setId(1L);
        dto.setLoanType("Personal");
        dto.setEmploymentType("Salaried");
        dto.setAmountRequested(50000.0);
        dto.setInterestRate(8.5);
        dto.setLoanApprovalDate(LocalDateTime.of(2024, 6, 1, 0, 0));
        dto.setLoanTenure(12);
        dto.setStatus("PENDING");
        dto.setUserId(3L);
        dto.setCreatedAt(LocalDateTime.now());
        return dto;
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void shouldApplyForLoanSuccessfully() throws Exception {
        LoanApplicationDTO application = new LoanApplicationDTO();
        application.setLoanType("Education");
        application.setEmploymentType("Self-Employed");
        application.setAmountRequested(100000.0);
        application.setInterestRate(7.5);
        application.setLoanTenure(24);

        Mockito.when(loanService.applyForLoan(any(), any())).thenReturn(getMockLoanDTO());

        mockMvc.perform(post("/api/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(application)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loanType").value("Personal"));
    }

    @Test
    @WithMockUser(roles = {"USER", "ADMIN"})
    void shouldReturnLoanById() throws Exception {
        Mockito.when(loanService.getLoanById(1L)).thenReturn(getMockLoanDTO());

        mockMvc.perform(get("/api/loans/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void shouldFetchUserLoanHistory() throws Exception {
        var loans = new PageImpl<>(List.of(getMockLoanDTO()), PageRequest.of(0, 10), 1);
        Mockito.when(loanService.getUserLoanHistory(any(), any())).thenReturn(loans);

        mockMvc.perform(get("/api/loans/history?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].userId").value(3L));
    }
}