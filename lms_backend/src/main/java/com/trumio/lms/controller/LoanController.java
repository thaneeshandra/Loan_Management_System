package com.trumio.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trumio.lms.dto.LoanApplicationDTO;
import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.dto.LoanStatsDTO;
import com.trumio.lms.service.LoanService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    // Any authenticated user (USER or ADMIN) can apply for a loan
    @PreAuthorize("hasRole('USER')")
    @PostMapping
    // Injected Authentication into the controller
    public ResponseEntity<LoanDTO> applyForLoan(@Valid @RequestBody LoanApplicationDTO loanDto,
            Authentication authentication) {
        LoanDTO createdLoan = loanService.applyForLoan(loanDto, authentication);
        return ResponseEntity.ok(createdLoan);
    }

    // USER or ADMIN can view a specific loan by ID
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<LoanDTO> getLoanById(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.getLoanById(id));
    }

    // USER: Get the current user's loans
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/history")
    public ResponseEntity<Page<LoanDTO>> getLoanHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            Authentication authentication
    ) {
        // Parse sort param (e.g., "createdAt,desc")
        String[] sortParams = sort.split(",");
        Pageable pageable = PageRequest.of(
            page,
            size,
            org.springframework.data.domain.Sort.by(
                sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") ?
                    org.springframework.data.domain.Sort.Direction.DESC :
                    org.springframework.data.domain.Sort.Direction.ASC,
                sortParams[0]
            )
        );
        return ResponseEntity.ok(loanService.getUserLoanHistory(authentication, pageable));
    }

    // USER: Get loan statistics for dashboard
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/stats")
    public ResponseEntity<LoanStatsDTO> getLoanStats(Authentication authentication) {
        return ResponseEntity.ok(loanService.getUserLoanStats(authentication));
    }

}