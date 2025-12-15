package com.trumio.lms.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.trumio.lms.enums.LoanStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private String loanType;
    private String employmentType;
    private Double amountRequested;
    private Double interestRate;
    private Integer loanTenure;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private LocalDateTime loanApprovalDate;
    private LocalDateTime closureDate;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;
 
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
 
    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL)
    private List<Transaction> transactions;

    @Column(name = "deleted")
    private Boolean deleted = false;
}
