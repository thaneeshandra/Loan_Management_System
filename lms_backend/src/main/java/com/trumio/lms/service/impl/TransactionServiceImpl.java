package com.trumio.lms.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.trumio.lms.dto.TransactionDTO;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.Transaction;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.LoanNotFoundException;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.repository.TransactionRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;
import com.trumio.lms.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService {

        @Autowired
        private TransactionRepository transactionRepository;

        @Autowired
        private LoanRepository loanRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private NotificationService notificationService;

        @Autowired
        private AuditLogService auditLogService;

        @Override
        public TransactionDTO createTransaction(TransactionDTO dto, Authentication authentication) {
                // Find the loan
                Loan loan = loanRepository.findById(dto.getLoanId())
                                .orElseThrow(() -> new LoanNotFoundException("Loan not found with ID: " + dto.getLoanId()));

                // Create transaction
                Transaction transaction = new Transaction();
                transaction.setAmount(dto.getAmount());
                transaction.setType(dto.getTransactionType());
                transaction
                                .setTransactionDate(dto.getTransactionDate() != null
                                                ? dto.getTransactionDate()
                                                : LocalDateTime.now());
                transaction.setLoan(loan);
                transaction.setStatus("COMPLETED");

                Transaction saved = transactionRepository.save(transaction);

                // Audit Log
                String performedBy = authentication.getName();
                auditLogService.logAction("CREATE_TRANSACTION", "TRANSACTION", transaction.getId(), performedBy);

                // Notify the user who owns the loan
                notificationService.sendNotification(loan.getUser(),
                                "New transaction recorded: Rs. " + saved.getAmount());

                return mapToDTO(saved);
        }

        // USER: View transaction for a specific loan (loan must belong to the
        // authenticated user)
        @Override
        public Page<TransactionDTO> getTransactionsByLoanId(Long loanId, Pageable pageable,
                        Authentication authentication) {
                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

                Loan loan = loanRepository.findById(loanId)
                                .orElseThrow(() -> new LoanNotFoundException("Loan not found with ID: " + loanId));

                if (!loan.getUser().getId().equals(user.getId())) {
                        throw new SecurityException("You are not authorized to view this loan's transaction.");
                }
                Page<Transaction> transactions = transactionRepository.findByLoanId(loanId, pageable);
                return transactions.map(this::mapToDTO);

        }

        // ADMIN: View all transactions (optional filters for type and status)
        @Override
        @PreAuthorize("hasRole('ADMIN')")
        public Page<TransactionDTO> getAllTransactions(String status, String type, Pageable pageable) {
                // Handle nulls for filters by defaulting to empty string (matches all)
                String safeStatus = status != null ? status : "";
                String safeType = type != null ? type : "";

                Page<Transaction> transactions = transactionRepository
                                .findByStatusContainingIgnoreCaseAndTypeContainingIgnoreCase(safeStatus, safeType,
                                                pageable);

                return transactions.map(this::mapToDTO);
        }

        // Converts entity to DTO
        private TransactionDTO mapToDTO(Transaction transaction) {
                TransactionDTO dto = new TransactionDTO();
                dto.setId(transaction.getId());
                dto.setAmount(transaction.getAmount());
                dto.setTransactionDate(transaction.getTransactionDate());
                dto.setTransactionType(transaction.getType());
                dto.setLoanId(transaction.getLoan().getId());
                return dto;
        }

}
