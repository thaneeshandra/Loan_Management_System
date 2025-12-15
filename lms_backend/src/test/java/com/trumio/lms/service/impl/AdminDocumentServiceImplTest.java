package com.trumio.lms.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.entity.Document;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.User;
import com.trumio.lms.exception.DocumentNotFoundException;
import com.trumio.lms.repository.DocumentRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

class AdminDocumentServiceImplTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AdminDocumentServiceImpl adminDocumentService;

    private Document sampleDocument;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        User user = new User();
        user.setId(100L);

        Loan loan = new Loan();
        loan.setId(200L);

        sampleDocument = new Document();
        sampleDocument.setId(1L);
        sampleDocument.setDocumentType("ID");
        sampleDocument.setDocumentCategory("KYC");
        sampleDocument.setFileName("doc.pdf");
        sampleDocument.setFilePath("/files/doc.pdf");
        sampleDocument.setFileSize(1024L);
        sampleDocument.setMimeType("application/pdf");
        sampleDocument.setUploadedAt(LocalDateTime.now());
        sampleDocument.setStatus("PENDING");
        sampleDocument.setUser(user);
        sampleDocument.setLoan(loan);
    }

    @Test
    void testGetAllDocumentsWithoutStatus() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Document> page = new PageImpl<>(java.util.List.of(sampleDocument));

        when(documentRepository.findAll(pageable)).thenReturn(page);

        Page<DocumentDTO> result = adminDocumentService.getAllDocuments(null, null, null, null, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("ID", result.getContent().get(0).getDocumentType());
    }

    @Test
    void testGetAllDocumentsWithStatus() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Document> page = new PageImpl<>(java.util.List.of(sampleDocument));

        when(documentRepository.findByStatus("PENDING", pageable)).thenReturn(page);

        Page<DocumentDTO> result = adminDocumentService.getAllDocuments("PENDING", null, null, null, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("PENDING", result.getContent().get(0).getStatus());
    }

    @Test
    void testApproveDocument() {
        when(documentRepository.findById(1L)).thenReturn(Optional.of(sampleDocument));
        when(documentRepository.save(any(Document.class))).thenReturn(sampleDocument);

        DocumentDTO result = adminDocumentService.approveDocument(1L);

        assertEquals("APPROVED", result.getStatus());
        verify(notificationService).sendNotification(eq(sampleDocument.getUser()), contains("approved"));
        verify(auditLogService).logAction(eq("APPROVE_DOCUMENT"), eq("Document"), eq(1L), eq("ADMIN"));
    }

    @Test
    void testRejectDocument() {
        when(documentRepository.findById(1L)).thenReturn(Optional.of(sampleDocument));
        when(documentRepository.save(any(Document.class))).thenReturn(sampleDocument);

        String reason = "Invalid document";
        DocumentDTO result = adminDocumentService.rejectDocument(1L, reason);

        assertEquals("REJECTED", result.getStatus());
        assertEquals(reason, result.getRejectionReason());
        verify(notificationService).sendNotification(eq(sampleDocument.getUser()), contains(reason));
        verify(auditLogService).logAction(eq("REJECT_DOCUMENT"), eq("Document"), eq(1L), eq("ADMIN"));
    }

    @Test
    void testApproveDocumentNotFound() {
        when(documentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(DocumentNotFoundException.class, () -> adminDocumentService.approveDocument(99L));
    }

    @Test
    void testRejectDocumentNotFound() {
        when(documentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(DocumentNotFoundException.class, () -> adminDocumentService.rejectDocument(99L, "reason"));
    }
}