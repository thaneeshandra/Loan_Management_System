package com.trumio.lms.dto;
 
import lombok.AllArgsConstructor;
import lombok.Data;
 
@Data
@AllArgsConstructor
public class UserStatsDTO {
    private long totalUsers;
    private long totalAdmins;
    private long totalNormalUsers;
}