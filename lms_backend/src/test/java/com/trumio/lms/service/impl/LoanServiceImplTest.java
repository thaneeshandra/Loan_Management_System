package com.trumio.lms.service.impl;
 
import com.trumio.lms.dto.LoanApplicationDTO;
import com.trumio.lms.dto.LoanDTO;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.entity.User;
import com.trumio.lms.enums.LoanStatus;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.repository.UserRepository;
import com.trumio.lms.service.AuditLogService;
import com.trumio.lms.service.NotificationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
 
import java.util.Arrays;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
public class LoanServiceImplTest {
 
    @Mock
    private LoanRepository loanRepository;
 
    @Mock
    private UserRepository userRepository;
 
    @Mock
    private Authentication authentication;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private NotificationService notificationService;
 
    @InjectMocks
    private LoanServiceImpl loanService;

    @InjectMocks
    private AdminLoanServiceImpl adminLoanServiceImpl;
 
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
 
    @Test
    public void testApplyForLoan_Success() {
        LoanApplicationDTO dto = new LoanApplicationDTO();
        dto.setLoanType("Personal");
        dto.setEmploymentType("Salaried");
        dto.setAmountRequested(10000.0);
        dto.setInterestRate(7.5);
        dto.setLoanTenure(12);
 
        User user = new User();
        user.setId(1L);
        user.setName("Test User");
        when(authentication.getName()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
 
        Loan loan = new Loan();
        loan.setId(1L);
        loan.setLoanType(dto.getLoanType());
        loan.setEmploymentType(dto.getEmploymentType());
        loan.setAmountRequested(dto.getAmountRequested());
        loan.setInterestRate(dto.getInterestRate());
        loan.setLoanTenure(dto.getLoanTenure());
        loan.setStatus(LoanStatus.PENDING);
        loan.setUser(user);
 
        when(loanRepository.save(ArgumentMatchers.any(Loan.class))).thenReturn(loan);
 
        LoanDTO result = loanService.applyForLoan(dto, authentication);
 
        assertNotNull(result);
        assertEquals("Personal", result.getLoanType());
        assertEquals(LoanStatus.PENDING.name(), result.getStatus());
        verify(loanRepository, times(1)).save(ArgumentMatchers.any(Loan.class));
    }
 
    @Test
    public void testGetLoanById_Found() {
        Loan loan = new Loan();
        loan.setId(1L);
        loan.setLoanType("Home");
        loan.setStatus(LoanStatus.APPROVED);
        loan.setUser(new User());
 
        when(loanRepository.findById(1L)).thenReturn(Optional.of(loan));
 
        LoanDTO result = loanService.getLoanById(1L);
 
        assertNotNull(result);
        assertEquals("Home", result.getLoanType());
        assertEquals(LoanStatus.APPROVED.name(), result.getStatus());
        verify(loanRepository, times(1)).findById(1L);
    }
 
    @Test
    public void testGetAllLoans() {
        Pageable pageable = PageRequest.of(0, 10);
        Loan loan1 = new Loan();
        loan1.setId(1L);
        loan1.setLoanType("Personal");
        loan1.setStatus(LoanStatus.PENDING);
        loan1.setUser(new User());
 
        Loan loan2 = new Loan();
        loan2.setId(2L);
        loan2.setLoanType("Home");
        loan2.setStatus(LoanStatus.APPROVED);
        loan2.setUser(new User());
 
        Page<Loan> loanPage = new PageImpl<>(Arrays.asList(loan1, loan2), pageable, 2);
        when(loanRepository.findAll(pageable)).thenReturn(loanPage);
 
        Page<LoanDTO> result = adminLoanServiceImpl.getAllLoans(pageable);
 
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        verify(loanRepository, times(1)).findAll(pageable);
    }
 
    @Test
    public void testUpdateLoanStatus() {
        Loan loan = new Loan();
        loan.setId(1L);
        loan.setStatus(LoanStatus.PENDING);
        loan.setUser(new User());
 
        when(loanRepository.findById(1L)).thenReturn(Optional.of(loan));
        when(loanRepository.save(loan)).thenReturn(loan);
 
        LoanDTO result = adminLoanServiceImpl.updateLoanStatus(1L, LoanStatus.APPROVED.name());
 
        assertNotNull(result);
        assertEquals(LoanStatus.APPROVED.name(), result.getStatus());
        verify(loanRepository, times(1)).save(loan);
    }
 
    @Test
    public void testGetLoansByStatus() {
        Pageable pageable = PageRequest.of(0, 10);
        Loan loan = new Loan();
        loan.setId(1L);
        loan.setLoanType("Personal");
        loan.setStatus(LoanStatus.PENDING);
        loan.setUser(new User());
 
        Page<Loan> loanPage = new PageImpl<>(Arrays.asList(loan), pageable, 1);
        when(loanRepository.findByStatus(LoanStatus.PENDING, pageable)).thenReturn(loanPage);
 
        Page<LoanDTO> result = adminLoanServiceImpl.getLoansByStatus(LoanStatus.PENDING.name(), pageable);
 
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(loanRepository, times(1)).findByStatus(LoanStatus.PENDING, pageable);
    }
 
    @Test
    public void testGetUserLoanHistory() {
        Pageable pageable = PageRequest.of(0, 10);
        User user = new User();
        user.setId(1L);
        when(authentication.getName()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
 
        Loan loan = new Loan();
        loan.setId(1L);
        loan.setLoanType("Personal");
        loan.setStatus(LoanStatus.APPROVED);
        loan.setUser(user);
 
        Page<Loan> loanPage = new PageImpl<>(Arrays.asList(loan), pageable, 1);
        when(loanRepository.findByUserId(1L, pageable)).thenReturn(loanPage);
 
        Page<LoanDTO> result = loanService.getUserLoanHistory(authentication, pageable);
 
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(loanRepository, times(1)).findByUserId(1L, pageable);
    }

    @Test
void applyForLoan_userNotFound_shouldThrowException() {
    when(authentication.getName()).thenReturn("missing@example.com");
    when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

    LoanApplicationDTO dto = new LoanApplicationDTO();
    dto.setLoanType("Personal");

    RuntimeException ex = assertThrows(RuntimeException.class, () ->
        loanService.applyForLoan(dto, authentication)
    );

    assertTrue(ex.getMessage().contains("User not found"));
}
@Test
void getLoanById_invalidId_shouldThrowException() {
    when(loanRepository.findById(999L)).thenReturn(Optional.empty());

    RuntimeException ex = assertThrows(RuntimeException.class, () ->
        loanService.getLoanById(999L)
    );

    assertTrue(ex.getMessage().contains("Loan not found"));
}

@Test
void getUserLoanHistory_userNotFound_shouldThrowException() {
    when(authentication.getName()).thenReturn("ghost@example.com");
    when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

    Pageable pageable = PageRequest.of(0, 5);

    RuntimeException ex = assertThrows(RuntimeException.class, () ->
        loanService.getUserLoanHistory(authentication, pageable)
    );

    assertTrue(ex.getMessage().contains("User not found"));
}
}