package com.trumio.lms.service;
 
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import com.trumio.lms.dto.DocumentDTO;
 
public interface UserDocumentService {
 
    // Upload a document
    DocumentDTO uploadDocument(DocumentDTO documentDTO, MultipartFile file, Authentication authentication);
 
    // Get all documents for authenticated user
    List<DocumentDTO> getDocumentsForUser(Authentication authentication);
 
    // Get documents for a specific loan (filtered by user)
    List<DocumentDTO> getDocumentsByUserAndLoan(Authentication authentication, Long loanId);
 
    // Download document if owned by the user
    Resource downloadDocument(Long documentId, Authentication authentication);
}
 