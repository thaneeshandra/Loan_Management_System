package com.trumio.lms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trumio.lms.dto.TransactionDTO;
import com.trumio.lms.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
@AutoConfigureMockMvc(addFilters = false)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @Autowired
    private ObjectMapper objectMapper;

    private TransactionDTO sampleTransaction;

    @BeforeEach
    void setUp() {
        sampleTransaction = new TransactionDTO();
        sampleTransaction.setId(1L);
        sampleTransaction.setAmount(2500.0);
        sampleTransaction.setTransactionType("EMI");
    }

    @Test
    void testCreateTransaction() throws Exception {
        when(transactionService.createTransaction(any(TransactionDTO.class), any()))
                .thenReturn(sampleTransaction);

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleTransaction)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.transactionType").value("EMI"));
    }

    @Test
    void testGetTransactionsByLoan() throws Exception {
        Page<TransactionDTO> mockPage = new PageImpl<>(Collections.singletonList(sampleTransaction));
        when(transactionService.getTransactionsByLoanId(eq(99L), any(), any()))
                .thenReturn(mockPage);

        mockMvc.perform(get("/api/transactions/loan/99")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L));
    }

    @Test
    void testGetAllTransactions() throws Exception {
        Page<TransactionDTO> mockPage = new PageImpl<>(Collections.singletonList(sampleTransaction));
        when(transactionService.getAllTransactions(eq("SUCCESS"), eq("EMI"), any()))
                .thenReturn(mockPage);

        mockMvc.perform(get("/api/transactions/admin")
                        .param("status", "SUCCESS")
                        .param("type", "EMI")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].transactionType").value("EMI"));
    }
}