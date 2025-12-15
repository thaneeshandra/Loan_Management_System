package com.trumio.lms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.trumio.lms.dto.LoanDTO;

public interface AdminLoanService {
    // New methods for pagination and filtering
    // List<LoanDTO> getAllLoans();
    Page<LoanDTO> getAllLoans(Pageable pageable);

    Page<LoanDTO> getLoansByStatus(String status, Pageable pageable);

    LoanDTO updateLoanStatus(Long loanId, String status);

	LoanDTO getLoanById(Long id);

}
