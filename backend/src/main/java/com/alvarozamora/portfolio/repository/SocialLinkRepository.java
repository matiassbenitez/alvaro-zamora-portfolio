package com.alvarozamora.portfolio.repository;

import com.alvarozamora.portfolio.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    List<SocialLink> findAllByOrderBySortOrderAsc();
}
