package com.trumio.lms.controller;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.service.AdminDocumentService;

class AdminDocumentControllerTest {

    @Mock
    private AdminDocumentService adminDocumentService;

    @InjectMocks
    private AdminDocumentController adminDocumentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllDocuments() {
        DocumentDTO document = new DocumentDTO();
        Page<DocumentDTO> page = new PageImpl<>(Collections.singletonList(document));
        PageRequest pageable = PageRequest.of(0, 10);

        when(adminDocumentService.getAllDocuments(null, null, null, null, pageable)).thenReturn(page);

        ResponseEntity<Page<DocumentDTO>> response = adminDocumentController.getAllDocuments(null, null, null, null, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getTotalElements());
        verify(adminDocumentService, times(1)).getAllDocuments(null, null, null, null, pageable);
    }

    @Test
    void testApproveDocument() {
        Long documentId = 1L;
        DocumentDTO document = new DocumentDTO();
        document.setId(documentId);

        when(adminDocumentService.approveDocument(documentId)).thenReturn(document);

        ResponseEntity<DocumentDTO> response = adminDocumentController.approveDocument(documentId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(documentId, response.getBody().getId());
        verify(adminDocumentService, times(1)).approveDocument(documentId);
    }

    @Test
    void testRejectDocument() {
        Long documentId = 2L;
        String reason = "Incomplete information";
        DocumentDTO document = new DocumentDTO();
        document.setId(documentId);

        when(adminDocumentService.rejectDocument(documentId, reason)).thenReturn(document);

        ResponseEntity<DocumentDTO> response = adminDocumentController.rejectDocument(documentId, reason);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(documentId, response.getBody().getId());
        verify(adminDocumentService, times(1)).rejectDocument(documentId, reason);
    }
}