package com.trumio.lms.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.trumio.lms.entity.Document;
import com.trumio.lms.entity.User;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    // For filtering documents by status with pagination
    Page<Document> findByStatus(String status, Pageable pageable);

    // For filtering documents by userId
    Page<Document> findAllByUser(User user, Pageable pageable);

    // For filtering documents by userId and status
    Page<Document> findByUserIdAndStatus(Long userId, String status, Pageable pageable);
    
    // For filtering documents by userId and loanId
    List<Document> findByUserIdAndLoanId(Long userId, Long loanId);
    
    // Pageable version of findByUserIdAndLoanId
    Page<Document> findPageableByUserIdAndLoanId(Long userId, Long loanId, Pageable pageable);
    
    // For filtering documents by loanId
    List<Document> findByLoanId(Long loanId);
    
    // Pageable version for loanId
    Page<Document> findByLoanId(Long loanId, Pageable pageable);
    
    // For filtering documents by status and loanId
    Page<Document> findByStatusAndLoanId(String status, Long loanId, Pageable pageable);
    
    // For filtering documents by status, userId and loanId
    Page<Document> findByStatusAndUserIdAndLoanId(String status, Long userId, Long loanId, Pageable pageable);

    Page<Document> findAllByDeletedFalse(Pageable pageable);

    Page<Document> findAllByStatusAndDeletedFalse(String status, Pageable pageable);

    Page<Document> findAllByUserAndDeletedFalse(User user, Pageable pageable);

    // For filtering documents by userId
    List<Document> findByUserId(Long userId);

}
