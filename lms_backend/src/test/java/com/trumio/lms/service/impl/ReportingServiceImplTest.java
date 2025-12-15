package com.trumio.lms.service.impl;
 
import com.trumio.lms.dto.LoanReportDTO;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.User;
import com.trumio.lms.enums.LoanStatus;
import com.trumio.lms.repository.LoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
 
import java.util.List;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
class ReportingServiceImplTest {
 
    @Mock
    private LoanRepository loanRepository;
 
    @InjectMocks
    private ReportingServiceImpl reportingService;
 
    private Loan loan;
    private User user;
 
    @SuppressWarnings("unused")
    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Alice");
 
        loan = new Loan();
        loan.setId(101L);
        loan.setStatus(LoanStatus.APPROVED);
        loan.setAmountRequested(50000.0);
        loan.setUser(user);
    }
 
    @Test
    void generateLoanReport_shouldReturnMappedLoanReportDTOList() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id"));
        Page<Loan> loanPage = new PageImpl<>(List.of(loan));
 
        when(loanRepository.findAll(any(Pageable.class))).thenReturn(loanPage);
 
        Page<LoanReportDTO> reports = reportingService.generateLoanReport(null, "id", "asc", pageable);
 
        assertEquals(1, reports.getTotalElements());
        LoanReportDTO dto = reports.getContent().get(0);
        assertEquals(101L, dto.getLoanId());
        assertEquals("APPROVED", dto.getStatus());
        assertEquals(50000.0, dto.getAmount());
        assertEquals("Alice", dto.getUserName());
 
        verify(loanRepository, times(1)).findAll(any(Pageable.class));
    }
 
    @Test
    void generateLoanReport_whenNoLoans_shouldReturnEmptyPage() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id"));
        Page<Loan> emptyPage = new PageImpl<>(List.of());
 
        when(loanRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);
 
        Page<LoanReportDTO> reports = reportingService.generateLoanReport(null, "id", "asc", pageable);
 
        assertTrue(reports.isEmpty());
        verify(loanRepository).findAll(any(Pageable.class));
    }
}
 