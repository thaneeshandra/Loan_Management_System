package com.trumio.lms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.trumio.lms.dto.DocumentDTO;

public interface AdminDocumentService {
    Page<DocumentDTO> getAllDocuments(String status, String search, Long userId, Long loanId, Pageable pageable);

    DocumentDTO approveDocument(Long documentId);

    DocumentDTO rejectDocument(Long documentId, String reason);
}