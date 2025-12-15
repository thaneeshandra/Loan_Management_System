package com.trumio.lms.service.impl;

import com.trumio.lms.dto.LoanReportDTO;
import com.trumio.lms.entity.Loan;
import com.trumio.lms.enums.LoanStatus;
import com.trumio.lms.repository.LoanRepository;
import com.trumio.lms.service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class ReportingServiceImpl implements ReportingService {

    @Autowired
    private LoanRepository loanRepository;

    @Override
    public Page<LoanReportDTO> generateLoanReport(String status, String sortBy, String order, Pageable pageable) {
        LoanStatus loanStatus = status != null && !status.isBlank() ? LoanStatus.valueOf(status.toUpperCase()) : null;

        Sort.Direction direction = order != null && order.equalsIgnoreCase("desc") ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(direction, sortBy != null ? sortBy : "id"));

        Page<Loan> loans = (loanStatus != null) ? loanRepository.findByStatus(loanStatus, sortedPageable)
                : loanRepository.findAll(sortedPageable);

        return loans.map(loan -> new LoanReportDTO(
                loan.getId(),
                loan.getStatus().name(),
                loan.getAmountRequested(),
                loan.getUser().getName()));
    }

}