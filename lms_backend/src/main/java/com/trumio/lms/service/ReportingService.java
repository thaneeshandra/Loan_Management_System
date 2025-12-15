package com.trumio.lms.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.trumio.lms.dto.LoanReportDTO;

public interface ReportingService {
    public Page<LoanReportDTO> generateLoanReport(String status, String sortBy, String order, Pageable pageable);
}