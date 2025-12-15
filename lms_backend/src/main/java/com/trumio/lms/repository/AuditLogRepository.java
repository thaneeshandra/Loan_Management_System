package com.trumio.lms.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trumio.lms.entity.AuditLog;
 
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}