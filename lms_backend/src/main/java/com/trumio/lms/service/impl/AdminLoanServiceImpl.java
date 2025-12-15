package com.trumio.lms.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.enums.LoanStatus;
import com.trumio.lms.exception.LoanNotFoundException;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.service.AdminLoanService;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

@Service
public class AdminLoanServiceImpl implements AdminLoanService {

    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private NotificationService notificationService;

    @Override
    public Page<LoanDTO> getAllLoans(Pageable pageable) {
        return loanRepository.findAll(pageable).map(LoanDTO::new);
    }

    @Override
    public Page<LoanDTO> getLoansByStatus(String status, Pageable pageable) {
        LoanStatus loanStatus = LoanStatus.valueOf(status.toUpperCase());
        return loanRepository.findByStatus(loanStatus, pageable).map(LoanDTO::new);
    }

    @Override
    public LoanDTO updateLoanStatus(Long loanId, String status) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new LoanNotFoundException("Loan not found with ID: " + loanId));

        loan.setStatus(LoanStatus.valueOf(status.toUpperCase()));
        loan.setUpdatedAt(LocalDateTime.now());

        if (loan.getStatus() == LoanStatus.APPROVED) {
            loan.setLoanApprovalDate(LocalDateTime.now());
        } else if (loan.getStatus() == LoanStatus.REJECTED) {
            loan.setClosureDate(LocalDateTime.now());
        }

        loanRepository.save(loan);

        auditLogService.logAction("UPDATE_LOAN_STATUS", "Loan", loan.getId(), "ADMIN");

        String message = loan.getStatus() == LoanStatus.APPROVED ? "Your loan has been approved."
                : "Your loan has been rejected.";
        notificationService.sendNotification(loan.getUser(), message);

        return new LoanDTO(loan);
    }

    @Override
    public LoanDTO getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan not found with ID: " + id));

        return new LoanDTO(loan);
    }
}