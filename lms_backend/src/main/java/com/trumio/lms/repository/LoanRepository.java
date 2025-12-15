package com.trumio.lms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trumio.lms.entity.Loan;
import com.trumio.lms.enums.LoanStatus;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    Page<Loan> findByStatus(LoanStatus status, Pageable pageable);

    List<Loan> findByStatus(LoanStatus status);

    Page<Loan> findByUserId(Long userId, Pageable pageable);
    
    // Add this method for getting all user loans (non-paginated)
    List<Loan> findByUserId(Long userId);

    // Optional override for clarity
    @Override
    Page<Loan> findAll(Pageable pageable);
}
