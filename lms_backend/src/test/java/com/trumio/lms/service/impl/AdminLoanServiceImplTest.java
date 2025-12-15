package com.trumio.lms.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.User;
import com.trumio.lms.enums.LoanStatus;
import com.trumio.lms.exception.LoanNotFoundException;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

@ExtendWith(MockitoExtension.class)
class AdminLoanServiceImplTest {

    @InjectMocks
    private AdminLoanServiceImpl loanService;

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private NotificationService notificationService;

    private Loan loan;

    @SuppressWarnings("unused")
    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        loan = new Loan();
        loan.setId(100L);
        loan.setUser(user);
        loan.setStatus(LoanStatus.PENDING);
    }

    @Test
    void getAllLoans_shouldReturnPageOfLoanDTOs() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Loan> page = new PageImpl<>(List.of(loan));
        when(loanRepository.findAll(pageable)).thenReturn(page);

        Page<LoanDTO> result = loanService.getAllLoans(pageable);

        assertEquals(1, result.getTotalElements());
        verify(loanRepository).findAll(pageable);
    }

    @Test
    void getLoansByStatus_shouldReturnFilteredLoans() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Loan> page = new PageImpl<>(List.of(loan));
        when(loanRepository.findByStatus(LoanStatus.PENDING, pageable)).thenReturn(page);

        Page<LoanDTO> result = loanService.getLoansByStatus("pending", pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(LoanStatus.PENDING.name(), result.getContent().get(0).getStatus());
    }

    @Test
    void updateLoanStatus_toApproved_shouldSetApprovalDate_andNotify() {
        when(loanRepository.findById(100L)).thenReturn(Optional.of(loan));
        when(loanRepository.save(any(Loan.class))).thenReturn(loan);

        LoanDTO result = loanService.updateLoanStatus(100L, "approved");

        assertEquals("APPROVED", result.getStatus());
        assertNotNull(loan.getLoanApprovalDate());
        verify(notificationService).sendNotification(eq(loan.getUser()), contains("approved"));
        verify(auditLogService).logAction(eq("UPDATE_LOAN_STATUS"), eq("Loan"), eq(100L), eq("ADMIN"));
    }

    @Test
    void updateLoanStatus_toRejected_shouldSetClosureDate_andNotify() {
        when(loanRepository.findById(100L)).thenReturn(Optional.of(loan));
        when(loanRepository.save(any(Loan.class))).thenReturn(loan);

        LoanDTO result = loanService.updateLoanStatus(100L, "rejected");

        assertEquals("REJECTED", result.getStatus());
        assertNotNull(loan.getClosureDate());
        verify(notificationService).sendNotification(eq(loan.getUser()), contains("rejected"));
        verify(auditLogService).logAction(eq("UPDATE_LOAN_STATUS"), eq("Loan"), eq(100L), eq("ADMIN"));
    }

    @Test
    void updateLoanStatus_whenLoanNotFound_shouldThrowException() {
        when(loanRepository.findById(200L)).thenReturn(Optional.empty());

        LoanNotFoundException exception = assertThrows(
            LoanNotFoundException.class,
            () -> loanService.updateLoanStatus(200L, "approved")
        );

        assertTrue(exception.getMessage().contains("Loan not found"));
    }

    @Test
    void getLoansByStatus_withInvalidStatus_shouldThrowException() {
        assertThrows(IllegalArgumentException.class, () ->
            loanService.getLoansByStatus("invalid_status", PageRequest.of(0, 5))
        );
    }
}