package com.trumio.lms.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.trumio.lms.dto.LoanApplicationDTO;
import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.dto.LoanStatsDTO;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.User;
import com.trumio.lms.enums.LoanStatus;
import com.trumio.lms.exception.LoanNotFoundException;
import com.trumio.lms.exception.UserNotFoundException;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.LoanService;
import com.trumio.lms.service.NotificationService;
import com.trumio.lms.service.SystemSettingService;

@Service
public class LoanServiceImpl implements LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SystemSettingService settingService;

    @Override
    public LoanDTO applyForLoan(LoanApplicationDTO loanDto, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + email));

        Loan loan = new Loan();
        loan.setLoanType(loanDto.getLoanType());
        loan.setEmploymentType(loanDto.getEmploymentType());
        loan.setAmountRequested(loanDto.getAmountRequested());

        // Use default interest rate from system settings if not provided
        Double requestedInterest = loanDto.getInterestRate();
        double interestRate;

        if (requestedInterest != null) {
            interestRate = requestedInterest;
        } else {
            String rateValue = settingService.getSettingValueOrDefault("DEFAULT_INTEREST_RATE", "8.5");
            interestRate = Double.parseDouble(rateValue);
        }
        loan.setInterestRate(interestRate);

        loan.setInterestRate(interestRate);
        loan.setLoanTenure(loanDto.getLoanTenure());
        loan.setCreatedAt(LocalDateTime.now());
        loan.setStatus(LoanStatus.PENDING);
        loan.setUser(user);

        loanRepository.save(loan);

        auditLogService.logAction("APPLY_LOAN", "Loan", loan.getId(), email);
        notificationService.sendNotification(user, "Your loan application has been submitted and is pending review.");

        return mapToDTO(loan);
    }

    @Override
    public LoanDTO getLoanById(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new LoanNotFoundException("Loan not found with ID: " + loanId));
        return mapToDTO(loan);
    }

    @Override
    public Page<LoanDTO> getUserLoanHistory(Authentication authentication, Pageable pageable) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + email));
        return loanRepository.findByUserId(user.getId(), pageable).map(this::mapToDTO);
    }

    @Override
    public LoanStatsDTO getUserLoanStats(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Loan> allUserLoans = loanRepository.findByUserId(user.getId());
        
        int totalLoans = allUserLoans.size();
        int activeLoans = (int) allUserLoans.stream()
            .filter(loan -> LoanStatus.APPROVED.equals(loan.getStatus())) // Fixed: Use enum instead of string
            .count();
        
        BigDecimal totalAmount = allUserLoans.stream()
            .map(Loan::getAmountRequested)
            .map(amount -> amount != null ? BigDecimal.valueOf(amount) : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal approvedAmount = allUserLoans.stream()
            .filter(loan -> LoanStatus.APPROVED.equals(loan.getStatus())) // Fixed: Use enum instead of string
            .map(Loan::getAmountRequested)
            .map(amount -> amount != null ? BigDecimal.valueOf(amount) : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new LoanStatsDTO(totalLoans, activeLoans, totalAmount, approvedAmount);
    }

    private LoanDTO mapToDTO(Loan loan) {
        LoanDTO dto = new LoanDTO();
        dto.setId(loan.getId());
        dto.setLoanType(loan.getLoanType());
        dto.setEmploymentType(loan.getEmploymentType());
        dto.setAmountRequested(loan.getAmountRequested());
        dto.setInterestRate(loan.getInterestRate());
        dto.setLoanTenure(loan.getLoanTenure());
        dto.setLoanApprovalDate(loan.getLoanApprovalDate());
        dto.setClosureDate(loan.getClosureDate());
        dto.setStatus(loan.getStatus().name());
        dto.setUserId(loan.getUser().getId());
        dto.setCreatedAt(loan.getCreatedAt());
        dto.setUserName(loan.getUser().getName());
        return dto;
    }
}
