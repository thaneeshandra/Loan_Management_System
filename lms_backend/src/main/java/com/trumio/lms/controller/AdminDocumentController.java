package com.trumio.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.service.AdminDocumentService;

@RestController
@RequestMapping("/api/admin/documents")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDocumentController {

    @Autowired
    private AdminDocumentService adminDocumentService;

   // Admin - Get all documents with pagination and optional filters
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<DocumentDTO>> getAllDocuments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long loanId,
            Pageable pageable) {
        return ResponseEntity.ok(adminDocumentService.getAllDocuments(status, search, userId, loanId, pageable));
    }

    // Admin - Approve a document
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<DocumentDTO> approveDocument(@PathVariable Long id) {
        return ResponseEntity.ok(adminDocumentService.approveDocument(id));
    }

    // Admin - Reject a document
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<DocumentDTO> rejectDocument(@PathVariable Long id, @RequestParam String reason) {
        return ResponseEntity.ok(adminDocumentService.rejectDocument(id, reason));
    }

}