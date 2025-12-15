package com.trumio.lms.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoanApplicationDTO {

    // @NotNull
    // private Long userId;  // Added userId field
    // Removed userId, The userId should be derived from logged-in user (via Authentication), not passed by the client

    @NotBlank
    private String loanType;

    @NotBlank
    private String employmentType;

    @NotNull
    @Min(1000)
    private Double amountRequested;

    @NotNull
    @DecimalMin("0.1")
    private Double interestRate;

    @NotNull
    @Min(1)
    private Integer loanTenure;

}