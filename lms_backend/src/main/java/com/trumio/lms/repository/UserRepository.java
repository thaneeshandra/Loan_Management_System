package com.trumio.lms.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.trumio.lms.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Page<User> findByActiveTrue(Pageable pageable);

    // New methods you're adding
    long countByRole_Name(String roleName);

    @Query("SELECT COUNT(u) FROM User u")
    long countTotalUsers();
    
}