package com.trumio.lms.service;

//import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import com.trumio.lms.dto.LoanApplicationDTO;
import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.dto.LoanStatsDTO;

public interface LoanService {

    // Methods added by your teammate
    // Updated new method signature
    LoanDTO applyForLoan(LoanApplicationDTO loanDto, Authentication authentication);

    LoanDTO getLoanById(Long loanId);

    // Changed method name from getLoansByUser to getUserLoanHistory
    Page<LoanDTO> getUserLoanHistory(Authentication authentication, Pageable pageable);

    LoanStatsDTO getUserLoanStats(Authentication authentication);
}