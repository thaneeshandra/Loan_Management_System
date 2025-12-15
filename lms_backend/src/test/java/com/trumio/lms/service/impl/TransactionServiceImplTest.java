package com.trumio.lms.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.trumio.lms.dto.TransactionDTO;
import com.trumio.lms.entity.*;
import com.trumio.lms.exception.LoanNotFoundException;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.*;

import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @Mock private TransactionRepository transactionRepository;
    @Mock private LoanRepository loanRepository;
    @Mock private UserRepository userRepository;
    @Mock private NotificationService notificationService;
    @Mock private AuditLogService auditLogService;
    @Mock private Authentication authentication;

    private Loan loan;
    private User user;

    @SuppressWarnings("unused")
    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        loan = new Loan();
        loan.setId(10L);
        loan.setUser(user);
    }

    // === Positive Test Cases ===

    @Test
    void createTransaction_whenLoanExists_shouldSaveTransactionAndNotify() {
        TransactionDTO dto = new TransactionDTO();
        dto.setLoanId(10L);
        dto.setAmount(5000.0);
        dto.setTransactionType("CREDIT");

        when(loanRepository.findById(10L)).thenReturn(Optional.of(loan));
        when(authentication.getName()).thenReturn("admin@example.com");

        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> {
                    Transaction saved = invocation.getArgument(0);
                    saved.setId(100L);
                    return saved;
                });

        TransactionDTO result = transactionService.createTransaction(dto, authentication);

        assertNotNull(result);
        assertEquals(10L, result.getLoanId());
        assertEquals("CREDIT", result.getTransactionType());

        verify(auditLogService).logAction("CREATE_TRANSACTION", "TRANSACTION", 100L, "admin@example.com");
        verify(notificationService).sendNotification(eq(user), contains("Rs. 5000"));
    }

    @Test
    void getTransactionsByLoanId_whenUserOwnsLoan_shouldReturnTransactions() {
        Pageable pageable = PageRequest.of(0, 5);
        Transaction t = new Transaction();
        t.setId(1L);
        t.setLoan(loan);
        t.setAmount(2000.0);
        t.setType("DEBIT");
        t.setTransactionDate(LocalDateTime.now());

        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(loanRepository.findById(10L)).thenReturn(Optional.of(loan));
        when(transactionRepository.findByLoanId(10L, pageable)).thenReturn(new PageImpl<>(List.of(t)));

        Page<TransactionDTO> result = transactionService.getTransactionsByLoanId(10L, pageable, authentication);

        assertEquals(1, result.getTotalElements());
        assertEquals("DEBIT", result.getContent().get(0).getTransactionType());
    }

    @Test
    void getAllTransactions_shouldReturnFilteredResults() {
        Pageable pageable = PageRequest.of(0, 5);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setLoan(loan);
        transaction.setStatus("COMPLETED");

        when(transactionRepository.findByStatusContainingIgnoreCaseAndTypeContainingIgnoreCase("COMPLETED", "DEBIT", pageable))
            .thenReturn(new PageImpl<>(List.of(transaction)));

        Page<TransactionDTO> result = transactionService.getAllTransactions("COMPLETED", "DEBIT", pageable);

        assertEquals(1, result.getTotalElements());
    }

    // === Negative / Edge Test Cases ===

    @Test
    void createTransaction_whenLoanNotFound_shouldThrowLoanNotFoundException() {
        TransactionDTO dto = new TransactionDTO();
        dto.setLoanId(999L);

        when(loanRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(LoanNotFoundException.class,
            () -> transactionService.createTransaction(dto, authentication));
    }

    @Test
    void getTransactionsByLoanId_whenUserNotFound_shouldThrowUserNotFoundException() {
        when(authentication.getName()).thenReturn("ghost@example.com");
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
            () -> transactionService.getTransactionsByLoanId(10L, PageRequest.of(0, 5), authentication));
    }

    @Test
    void getTransactionsByLoanId_whenLoanNotFound_shouldThrowLoanNotFoundException() {
        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(loanRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(LoanNotFoundException.class,
            () -> transactionService.getTransactionsByLoanId(99L, PageRequest.of(0, 5), authentication));
    }

    @Test
    void getTransactionsByLoanId_whenUserDoesNotOwnLoan_shouldThrowSecurityException() {
        User anotherUser = new User();
        anotherUser.setId(2L);
        loan.setUser(anotherUser);

        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(loanRepository.findById(10L)).thenReturn(Optional.of(loan));

        assertThrows(SecurityException.class,
            () -> transactionService.getTransactionsByLoanId(10L, PageRequest.of(0, 5), authentication));
    }
}