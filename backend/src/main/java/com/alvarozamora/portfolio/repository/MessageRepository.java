package com.alvarozamora.portfolio.repository;

import com.alvarozamora.portfolio.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByOrderByCreatedAtDesc();

    List<Message> findAllByReadFlagFalseOrderByCreatedAtDesc();

    long countByReadFlagFalse();
}
