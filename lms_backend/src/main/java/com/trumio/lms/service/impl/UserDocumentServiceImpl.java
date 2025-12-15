package com.trumio.lms.service.impl;
 
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.trumio.lms.dto.DocumentDTO;
import com.trumio.lms.entity.Document;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.User;
import com.trumio.lms.repository.DocumentRepository;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.UserDocumentService;
 
@Service
public class UserDocumentServiceImpl implements UserDocumentService {
 
    @Autowired
    private DocumentRepository documentRepository;
 
    @Autowired
    private UserRepository userRepository;
 
    @Autowired
    private LoanRepository loanRepository;
 
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
 
    @Override
    public DocumentDTO uploadDocument(DocumentDTO documentDTO, MultipartFile file, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
 
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }
 
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
 
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                throw new RuntimeException("Invalid file name");
            }
 
            originalFilename = StringUtils.cleanPath(originalFilename);
            String fileExtension = originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
 
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
 
            Document doc = new Document();
            doc.setDocumentType(documentDTO.getDocumentType());
            doc.setDocumentCategory(documentDTO.getDocumentCategory());
            doc.setFileName(originalFilename);
            doc.setFilePath(filePath.toString());
            doc.setFileSize(file.getSize());
            doc.setMimeType(file.getContentType());
            doc.setUploadedAt(LocalDateTime.now());
            doc.setStatus("PENDING");
            doc.setUser(user);
            doc.setBankName(documentDTO.getBankName());
            doc.setBankAccountNumber(documentDTO.getBankAccountNumber());
            doc.setIfscCode(documentDTO.getIfscCode());
 
            if (documentDTO.getLoanId() != null) {
                Loan loan = loanRepository.findById(documentDTO.getLoanId())
                        .orElseThrow(() -> new RuntimeException("Loan not found"));
                doc.setLoan(loan);
            }
 
            Document savedDoc = documentRepository.save(doc);
            return convertToDTO(savedDoc);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
 
    @Override
    public List<DocumentDTO> getDocumentsForUser(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return documentRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDTO)
                .toList();
    }
 
    @Override
    public List<DocumentDTO> getDocumentsByUserAndLoan(Authentication authentication, Long loanId) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
 
        List<Document> documents = (loanId != null)
                ? documentRepository.findByUserIdAndLoanId(user.getId(), loanId)
                : documentRepository.findByUserId(user.getId());
 
        return documents.stream().map(this::convertToDTO).toList();
    }
 
    @Override
    public Resource downloadDocument(Long documentId, Authentication authentication) {
        try {
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));
 
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
 
            if (!document.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized access to document");
            }
 
            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
 
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file: " + e.getMessage());
        }
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
        dto.setUserId(doc.getUser().getId());
        if (doc.getLoan() != null) {
            dto.setLoanId(doc.getLoan().getId());
        }
        return dto;
    }
}
 