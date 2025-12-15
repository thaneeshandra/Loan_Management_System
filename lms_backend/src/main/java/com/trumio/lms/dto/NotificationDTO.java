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
public class NotificationDTO { 
   private Long id; 
   private String message; 
   private Boolean isRead; 
   private LocalDateTime timestamp; 
   private Long userId; 

}
