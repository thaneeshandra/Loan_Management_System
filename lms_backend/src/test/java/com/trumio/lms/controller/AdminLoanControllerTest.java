package com.trumio.lms.controller;

import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.service.AdminLoanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminLoanController.class)
class AdminLoanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminLoanService adminLoanService;

    private List<LoanDTO> loanDTOList;

    @BeforeEach
    void setup() {
        LoanDTO sampleLoan = new LoanDTO();
        sampleLoan.setId(1L);
        loanDTOList = List.of(sampleLoan);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllLoans() throws Exception {
        Page<LoanDTO> mockPage = new PageImpl<>(loanDTOList);
        Mockito.when(adminLoanService.getAllLoans(any(PageRequest.class))).thenReturn(mockPage);

        mockMvc.perform(get("/api/admin/loans")
                        .param("page", "0")
                        .param("size", "10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1));
    }
}