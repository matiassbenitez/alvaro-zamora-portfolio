package com.alvarozamora.portfolio.repository;

import com.alvarozamora.portfolio.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderBySortOrderAscCreatedAtDesc();

    List<Project> findAllByPublishedTrueOrderBySortOrderAscCreatedAtDesc();

    List<Project> findAllByOrderByLikeCountDesc();

    Optional<Project> findBySlug(String slug);

    Optional<Project> findById(Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
