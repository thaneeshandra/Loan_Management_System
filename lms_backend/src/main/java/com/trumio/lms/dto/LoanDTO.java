package com.trumio.lms.dto;

import java.time.LocalDateTime;

import com.trumio.lms.entity.Loan;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class LoanDTO { 

    private Long id; 
    private String loanType; 
    private String employmentType; 
    private Double amountRequested; 
    private Double interestRate; 
    private LocalDateTime loanApprovalDate; 
    private LocalDateTime closureDate; 
    private Integer loanTenure; 
    private String status; 
    private Long userId;
    private LocalDateTime createdAt;
    private String userName;

   

    public LoanDTO(Loan loan) {
    this.id = loan.getId();
    this.loanType = loan.getLoanType();
    this.employmentType = loan.getEmploymentType();
    this.amountRequested = loan.getAmountRequested();
    this.interestRate = loan.getInterestRate();
    this.loanApprovalDate = loan.getLoanApprovalDate();
    this.closureDate = loan.getClosureDate();
    this.loanTenure = loan.getLoanTenure();
    this.status = loan.getStatus().name();
    this.userId = loan.getUser().getId();
    this.createdAt = loan.getCreatedAt();
    this.userName = loan.getUser().getName();
}

  
}