package com.alvarozamora.portfolio.repository;

import com.alvarozamora.portfolio.entity.LikeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRecordRepository extends JpaRepository<LikeRecord, Long> {
    boolean existsByProjectIdAndVisitorToken(Long projectId, String visitorToken);

    long countByProjectId(Long projectId);
}
