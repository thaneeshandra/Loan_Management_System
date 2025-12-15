package com.trumio.lms.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.entity.Document;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.DocumentNotFoundException;
import com.trumio.lms.repository.DocumentRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AdminDocumentService;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

@Service
public class AdminDocumentServiceImpl implements AdminDocumentService {

    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Page<DocumentDTO> getAllDocuments(String status, String search, Long userId, Long loanId,
            Pageable pageable) {
        // Start with base query
        Page<Document> docs;

        // Apply filters one by one based on provided parameters
        if (status != null && userId != null && loanId != null) {
            // All filters provided
            docs = documentRepository.findByStatusAndUserIdAndLoanId(status, userId, loanId, pageable);
        } else if (status != null && userId != null) {
            // Status and userId only
            docs = documentRepository.findByUserIdAndStatus(userId, status, pageable);
        } else if (status != null && loanId != null) {
            // Status and loanId only
            docs = documentRepository.findByStatusAndLoanId(status, loanId, pageable);
        } else if (userId != null && loanId != null) {
            // userId and loanId only
            docs = documentRepository.findPageableByUserIdAndLoanId(userId, loanId, pageable);
        } else if (status != null) {
            // Status only
            docs = documentRepository.findByStatus(status, pageable);
        } else if (userId != null) {
            // userId only
            User user = userRepository.findById(userId).orElse(null);
            docs = (user != null) ? documentRepository.findAllByUser(user, pageable) : Page.empty(pageable);
        } else if (loanId != null) {
            // loanId only
            docs = documentRepository.findByLoanId(loanId, pageable);
        } else {
            // No filters, return all
            docs = documentRepository.findAll(pageable);
        }

        // Apply search filter if provided
        // Note: This is a simplistic approach. In a production system,
        // you would want to implement this at the database level with a proper query
        if (search != null && !search.isEmpty()) {
            // We need to get the content and filter it manually
            // This is inefficient but serves as a temporary solution
            List<Document> filteredDocs = docs.getContent().stream()
                    .filter(doc -> doc.getDocumentType() != null &&
                            doc.getDocumentType().toLowerCase().contains(search.toLowerCase()))
                    .toList();

            // Create a new page from the filtered list
            final int start = (int) pageable.getOffset();
            final int end = Math.min((start + pageable.getPageSize()), filteredDocs.size());

            return new PageImpl<>(
                    filteredDocs.subList(start, end),
                    pageable,
                    filteredDocs.size()).map(this::convertToDTO);
        }

        return docs.map(this::convertToDTO);
    }

    @Override
    public DocumentDTO approveDocument(Long documentId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found"));
        doc.setStatus("APPROVED");
        doc.setVerifiedAt(LocalDateTime.now());
        documentRepository.save(doc);
        notificationService.sendNotification(doc.getUser(), "Your document has been approved.");
        auditLogService.logAction("APPROVE_DOCUMENT", "Document", doc.getId(), "ADMIN");
        return convertToDTO(doc);
    }

    @Override
    public DocumentDTO rejectDocument(Long documentId, String reason) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found"));
        doc.setStatus("REJECTED");
        doc.setRejectionReason(reason);
        doc.setVerifiedAt(LocalDateTime.now());
        documentRepository.save(doc);
        notificationService.sendNotification(doc.getUser(), "Your document has been rejected. Reason: " + reason);
        auditLogService.logAction("REJECT_DOCUMENT", "Document", doc.getId(), "ADMIN");
        return convertToDTO(doc);
    }

    private DocumentDTO convertToDTO(Document doc) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(doc.getId());
        dto.setDocumentType(doc.getDocumentType());
        dto.setDocumentCategory(doc.getDocumentCategory());
        dto.setFileName(doc.getFileName());
        dto.setFilePath(doc.getFilePath());
        dto.setFileSize(doc.getFileSize());
        dto.setMimeType(doc.getMimeType());
        dto.setUploadedAt(doc.getUploadedAt());
        dto.setStatus(doc.getStatus());
        dto.setVerifiedAt(doc.getVerifiedAt());
        dto.setRejectionReason(doc.getRejectionReason());
        dto.setBankName(doc.getBankName());
        dto.setBankAccountNumber(doc.getBankAccountNumber());
        dto.setIfscCode(doc.getIfscCode());

        // Add null check for user
        if (doc.getUser() != null) {
            dto.setUserId(doc.getUser().getId());
        }

        if (doc.getLoan() != null) {
            dto.setLoanId(doc.getLoan().getId());
        }
        return dto;
    }

}