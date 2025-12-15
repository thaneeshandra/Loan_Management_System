package com.trumio.lms.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class TransactionDTO { 
   private Long id; 
   private String transactionType; 
   private Double amount; 
   private LocalDateTime transactionDate; 
   private Long loanId;

 }