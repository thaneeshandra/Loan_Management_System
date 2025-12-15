package com.trumio.lms.dto;

import jakarta.persistence.Column;

public class UserProfileDTO {
    private String name;
    private String email;
    @Column(name="mobile_number")
    private String mobileNumber;
    private String address;
    private String role;
 
    public UserProfileDTO() {}
 
    public UserProfileDTO(String name, String email, String mobileNumber, String address, String role) {
        this.name = name;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.role = role;
    }
 
    public String getName() {
         return name; 
        }

    public void setName(String name) { 
        
        this.name = name; 
    }
 
    public String getEmail() { 
        return email; 
    }

    public void setEmail(String email) { 
        this.email = email; 
    }
 
    public String getMobileNumber() {
         return mobileNumber; 
        }
    public void setMobileNumber(String mobileNumber) { 
        this.mobileNumber = mobileNumber; 
    }
 
    public String getAddress() { 
        return address;
     }
    public void setAddress(String address) {
         this.address = address;
         }
 
    public String getRole() { 
        return role; 
    }
    public void setRole(String role) {
         this.role = role;
         }
}