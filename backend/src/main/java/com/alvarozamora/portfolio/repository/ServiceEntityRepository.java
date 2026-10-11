package com.alvarozamora.portfolio.repository;

import com.alvarozamora.portfolio.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceEntityRepository extends JpaRepository<ServiceEntity, Long> {
    List<ServiceEntity> findAllByOrderBySortOrderAsc();

    List<ServiceEntity> findAllByActiveTrueOrderBySortOrderAsc();
}
