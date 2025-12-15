package com.trumio.lms.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
 public class UserDTO { 
    
    private Long id;
    private String name;
    private String email;
    @Column(name="mobile_number")
    private String mobileNumber;
    private String address;
    private String role;
    private boolean active = true;

    // Add this constructor to accept a User object
    public UserDTO(com.trumio.lms.entity.User user) {
        // Initialize UserDTO fields from the User object
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobileNumber = user.getMobileNumber();
        this.address = user.getAddress();
        this.role = user.getRole() != null ? user.getRole().getName() : null;
    }
}
