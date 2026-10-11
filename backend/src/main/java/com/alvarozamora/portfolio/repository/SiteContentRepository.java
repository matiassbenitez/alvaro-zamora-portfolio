package com.alvarozamora.portfolio.repository;

import com.alvarozamora.portfolio.entity.SiteContent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {
}
