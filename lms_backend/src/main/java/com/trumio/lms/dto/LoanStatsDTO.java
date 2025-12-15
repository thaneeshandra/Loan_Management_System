package com.trumio.lms.dto;

import java.math.BigDecimal;

public class LoanStatsDTO {
    private int totalLoans;
    private int activeLoans;
    private BigDecimal totalAmount;
    private BigDecimal approvedAmount;
    
    // Default constructor
    public LoanStatsDTO() {}
    
    // Constructor with parameters
    public LoanStatsDTO(int totalLoans, int activeLoans, BigDecimal totalAmount, BigDecimal approvedAmount) {
        this.totalLoans = totalLoans;
        this.activeLoans = activeLoans;
        this.totalAmount = totalAmount;
        this.approvedAmount = approvedAmount;
    }
    
    // Getters and setters
    public int getTotalLoans() {
        return totalLoans;
    }
    
    public void setTotalLoans(int totalLoans) {
        this.totalLoans = totalLoans;
    }
    
    public int getActiveLoans() {
        return activeLoans;
    }
    
    public void setActiveLoans(int activeLoans) {
        this.activeLoans = activeLoans;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public BigDecimal getApprovedAmount() {
        return approvedAmount;
    }
    
    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }
}