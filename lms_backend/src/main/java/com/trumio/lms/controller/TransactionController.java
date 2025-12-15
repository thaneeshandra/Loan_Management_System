package com.trumio.lms.controller;
 
import com.trumio.lms.dto.TransactionDTO;
import com.trumio.lms.service.TransactionService;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
 
    @Autowired
    private TransactionService transactionService;
 
    /**
     * Create a new transaction for a loan.
     * Accessible by authenticated users (e.g., for EMI payments or system-created transactions).
     */
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @RequestBody TransactionDTO transactionDTO,
            Authentication authentication) {
        TransactionDTO created = transactionService.createTransaction(transactionDTO, authentication);
        return ResponseEntity.ok(created);
    }
 
    /**
     * User-side: Get transactions for a specific loan.
     */
    @GetMapping("/loan/{loanId}")
    public ResponseEntity<Page<TransactionDTO>> getTransactionsByLoan(
            @PathVariable Long loanId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDTO> transactions = transactionService.getTransactionsByLoanId(loanId, pageable, authentication);
        return ResponseEntity.ok(transactions);
    }
 
    /**
     * Admin-side: Get all transactions with optional filters.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<Page<TransactionDTO>> getAllTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDTO> transactions = transactionService.getAllTransactions(status, type, pageable);
        return ResponseEntity.ok(transactions);
    }
}