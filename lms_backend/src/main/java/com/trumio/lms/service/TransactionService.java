package com.trumio.lms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import com.trumio.lms.dto.TransactionDTO;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO dto, Authentication authentication);

    // Get transaction for a specific loan for the logged-in user
    Page<TransactionDTO> getTransactionsByLoanId(Long loanId, Pageable pageable, Authentication authentication);

    // Admin: Get all transactions (optionally filter by status/type) 
    Page<TransactionDTO> getAllTransactions(String status, String type, Pageable pageable);
}
