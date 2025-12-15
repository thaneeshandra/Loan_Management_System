package com.trumio.lms.controller;
 
import com.trumio.lms.dto.LoanReportDTO;
import com.trumio.lms.service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/admin/reports/loans")
public class LoanReportController {
 
    @Autowired
    private ReportingService reportingService;
 
    @GetMapping
    public Page<LoanReportDTO> getLoanReport(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
 
        Pageable pageable = PageRequest.of(page, size);
        return reportingService.generateLoanReport(status, sortBy, order, pageable);
    }
}