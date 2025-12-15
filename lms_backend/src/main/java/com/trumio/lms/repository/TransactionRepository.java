package com.trumio.lms.repository;
 
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trumio.lms.entity.Transaction;
 
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
 
    // For user-side: Get transactions for a specific loan
    Page<Transaction> findByLoanId(Long loanId, Pageable pageable);
 
    // For admin: Optional filters
    Page<Transaction> findByStatusContainingIgnoreCaseAndTypeContainingIgnoreCase(
        String status, String type, Pageable pageable
    );

}