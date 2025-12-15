package com.trumio.lms.controller;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.service.UserDocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentControllerTest {

    @Mock
    private UserDocumentService documentService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private DocumentController documentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUploadDocument() {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "Dummy content".getBytes());
        DocumentDTO inputDTO = new DocumentDTO();
        inputDTO.setDocumentType("ID");
        inputDTO.setDocumentCategory("KYC");
        inputDTO.setLoanId(123L);

        DocumentDTO returnedDTO = new DocumentDTO();
        returnedDTO.setId(1L);

        when(documentService.uploadDocument(any(DocumentDTO.class), eq(file), eq(authentication)))
                .thenReturn(returnedDTO);

        ResponseEntity<DocumentDTO> response = documentController.uploadDocument(
                file, "ID", "KYC", 123L, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        verify(documentService).uploadDocument(any(DocumentDTO.class), eq(file), eq(authentication));
    }

    @Test
    void testGetUserDocumentsWithoutLoanId() {
        DocumentDTO doc = new DocumentDTO();
        doc.setId(1L);
        List<DocumentDTO> docs = Collections.singletonList(doc);

        when(documentService.getDocumentsForUser(authentication)).thenReturn(docs);

        ResponseEntity<List<DocumentDTO>> response = documentController.getUserDocuments(authentication, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(documentService).getDocumentsForUser(authentication);
    }

    @Test
    void testGetUserDocumentsWithLoanId() {
        Long loanId = 456L;
        DocumentDTO doc = new DocumentDTO();
        doc.setId(2L);
        List<DocumentDTO> docs = Collections.singletonList(doc);

        when(documentService.getDocumentsByUserAndLoan(authentication, loanId)).thenReturn(docs);

        ResponseEntity<List<DocumentDTO>> response = documentController.getUserDocuments(authentication, loanId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(documentService).getDocumentsByUserAndLoan(authentication, loanId);
    }

    @Test
    void testDownloadDocument() {
        Long docId = 1L;
        Resource resource = new ByteArrayResource("Test content".getBytes()) {
            @Override
            public String getFilename() {
                return "test.pdf";
            }
        };

        when(documentService.downloadDocument(docId, authentication)).thenReturn(resource);

        ResponseEntity<Resource> response = documentController.downloadDocument(docId, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test.pdf", response.getBody().getFilename());
        assertTrue(response.getHeaders().getFirst("Content-Disposition").contains("attachment"));
    }

    @Test
    void testViewDocument() {
        Long docId = 2L;
        Resource resource = new ByteArrayResource("View content".getBytes()) {
            @Override
            public String getFilename() {
                return "view.pdf";
            }
        };

        when(documentService.downloadDocument(docId, authentication)).thenReturn(resource);

        ResponseEntity<Resource> response = documentController.viewDocument(docId, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("view.pdf", response.getBody().getFilename());
        assertTrue(response.getHeaders().getFirst("Content-Disposition").contains("inline"));
    }
}