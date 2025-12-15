package com.trumio.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanReportDTO {
    private Long loanId;
    private String status;
    private Double amount;
    private String userName;
}