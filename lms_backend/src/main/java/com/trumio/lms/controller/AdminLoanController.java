package com.trumio.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.service.AdminLoanService;

@RestController
@RequestMapping("/api/admin/loans")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminLoanController {

    @Autowired
    private AdminLoanService adminLoanService;

    // Only ADMIN can view all loans
    // ADMIN: Get paginated and filtered loan list
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<LoanDTO>> getAllLoans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page, size);

        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(adminLoanService.getLoansByStatus(status, pageable));
        } else {
            return ResponseEntity.ok(adminLoanService.getAllLoans(pageable));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanDTO> getAdminLoanById(@PathVariable Long id) {
        return ResponseEntity.ok(adminLoanService.getLoanById(id));
    }

    // Only ADMIN can update loan status
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<LoanDTO> updateLoanStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        return ResponseEntity.ok(adminLoanService.updateLoanStatus(id, status));
    }

}