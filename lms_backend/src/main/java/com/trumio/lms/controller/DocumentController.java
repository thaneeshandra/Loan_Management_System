package com.trumio.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.service.UserDocumentService;

@RestController
@RequestMapping("/api")
public class DocumentController {

    @Autowired
    private UserDocumentService documentService;

    // Upload a document (user) - Updated to handle multipart file upload
    @PreAuthorize("hasRole('USER')")
    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam("documentCategory") String documentCategory,
            @RequestParam("loanId") Long loanId,
            Authentication authentication) {
        
        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO.setDocumentType(documentType);
        documentDTO.setDocumentCategory(documentCategory);
        documentDTO.setLoanId(loanId);
        
        return ResponseEntity.ok(documentService.uploadDocument(documentDTO, file, authentication));
    }

    // Get all documents uploaded by logged-in user
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/documents/user")
    public ResponseEntity<List<DocumentDTO>> getUserDocuments(
            Authentication authentication,
            @RequestParam(required = false) Long loanId) {
        if (loanId != null) {
            return ResponseEntity.ok(documentService.getDocumentsByUserAndLoan(authentication, loanId));
        }
        return ResponseEntity.ok(documentService.getDocumentsForUser(authentication));
    }

    // Download a document
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id, Authentication authentication) {
        Resource resource = documentService.downloadDocument(id, authentication);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // View a document (open in browser)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/documents/{id}/view")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long id, Authentication authentication) {
        Resource resource = documentService.downloadDocument(id, authentication);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    
}