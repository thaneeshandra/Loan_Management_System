package com.trumio.lms.dto;

public class UserRegistrationDTO {
    private String name;
    private String email;
    private String password;
    private String mobileNumber;
    private String address;
    private boolean active = true;
    private String role;  //Accept "USER" or "ADMIN"

    // Constructors
    public UserRegistrationDTO() {}

    // Getters and setters
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

    public String getPassword() {
         return password; 
        }
    public void setPassword(String password) { 
        this.password = password;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
