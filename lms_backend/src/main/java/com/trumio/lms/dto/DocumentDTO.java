package com.trumio.lms.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {

  private Long id;

  @NotBlank(message = "Document type is required")
  private String documentType;
  private String documentCategory;
  private String fileName;
  private String filePath;
  private Long fileSize;
  private String mimeType;

  private LocalDateTime uploadedAt;
  private String status;
  private LocalDateTime verifiedAt;
  private String rejectionReason;

  @NotBlank(message = "Bank name is required")
  private String bankName;

  @NotBlank(message = "Bank account number is required")
  private String bankAccountNumber;

  @NotBlank(message = "IFSC code is required")
  private String ifscCode;

  @NotNull(message = "User ID is required")
  private Long userId;
  private Long loanId;
  private boolean deleted = false;
  private String userName;
}