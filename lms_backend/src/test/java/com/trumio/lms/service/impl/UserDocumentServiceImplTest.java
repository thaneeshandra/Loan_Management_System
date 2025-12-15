package com.trumio.lms.service.impl;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.entity.Document;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.User;
import com.trumio.lms.repository.DocumentRepository;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserDocumentServiceImplTest {

    @Mock private DocumentRepository documentRepository;
    @Mock private UserRepository userRepository;
    @Mock private LoanRepository loanRepository;
    @Mock private Authentication authentication;

    @InjectMocks private UserDocumentServiceImpl userDocumentService;

    private User user;
    private Document document;
    private Loan loan;
    private Path tempUploadDir;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        loan = new Loan();
        loan.setId(10L);

        document = new Document();
        document.setId(100L);
        document.setUser(user);
        document.setLoan(loan);
        document.setFilePath("uploads/test.pdf");

        when(authentication.getName()).thenReturn("user@example.com");

        // ✅ Set private field uploadDir via reflection
        tempUploadDir = Files.createTempDirectory("test-uploads");
        Field uploadDirField = UserDocumentServiceImpl.class.getDeclaredField("uploadDir");
        uploadDirField.setAccessible(true);
        uploadDirField.set(userDocumentService, tempUploadDir.toString());
    }

    @AfterEach
    void tearDown() throws IOException {
        Files.walk(tempUploadDir)
             .sorted((a, b) -> b.compareTo(a))
             .forEach(path -> path.toFile().delete());
    }

    @Test
    void testUploadDocumentSuccess() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "dummy content".getBytes());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(loanRepository.findById(10L)).thenReturn(Optional.of(loan));
        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> {
            Document saved = invocation.getArgument(0);
            saved.setId(123L);
            return saved;
        });

        DocumentDTO dto = new DocumentDTO();
        dto.setDocumentType("ID");
        dto.setDocumentCategory("KYC");
        dto.setLoanId(10L);

        DocumentDTO result = userDocumentService.uploadDocument(dto, file, authentication);

        assertNotNull(result);
        assertEquals("ID", result.getDocumentType());
        assertEquals(123L, result.getId());
    }

    @Test
    void testGetDocumentsForUser() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(documentRepository.findByUserId(1L)).thenReturn(List.of(document));

        List<DocumentDTO> result = userDocumentService.getDocumentsForUser(authentication);

        assertEquals(1, result.size());
        assertEquals(100L, result.get(0).getId());
    }

    @Test
    void testGetDocumentsByUserAndLoan() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(documentRepository.findByUserIdAndLoanId(1L, 10L)).thenReturn(List.of(document));

        List<DocumentDTO> result = userDocumentService.getDocumentsByUserAndLoan(authentication, 10L);

        assertEquals(1, result.size());
        assertEquals(100L, result.get(0).getId());
    }

    @Test
    void testDownloadDocumentSuccess() throws IOException {
        Path filePath = Files.createTempFile(tempUploadDir, "test", ".pdf");
        Files.writeString(filePath, "dummy content");
        document.setFilePath(filePath.toString());

        when(documentRepository.findById(100L)).thenReturn(Optional.of(document));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        Resource resource = userDocumentService.downloadDocument(100L, authentication);

        assertTrue(resource.exists());
        assertEquals(filePath.getFileName().toString(), resource.getFilename());
    }

    @Test
    void testDownloadDocumentUnauthorized() {
        User anotherUser = new User();
        anotherUser.setId(999L);
        document.setUser(anotherUser);

        when(documentRepository.findById(100L)).thenReturn(Optional.of(document));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userDocumentService.downloadDocument(100L, authentication));

        assertTrue(ex.getMessage().contains("Unauthorized"));
    }
}