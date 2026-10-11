package com.alvarozamora.portfolio.service;

import com.alvarozamora.portfolio.dto.DashboardDtos;
import com.alvarozamora.portfolio.dto.MessageDtos;
import com.alvarozamora.portfolio.repository.MessageRepository;
import com.alvarozamora.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final MessageRepository messageRepository;
    private final LikeService likeService;

    public DashboardDtos.DashboardSummary summary() {
        List<MessageDtos.MessageResponse> recent = messageRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(m -> new MessageDtos.MessageResponse(
                        m.getId(), m.getName(), m.getEmail(), m.getSubject(), m.getBody(), m.getReadFlag(), m.getCreatedAt()))
                .toList();

        DashboardDtos.LikesPanel likesPanel = likeService.likesPanel();

        return new DashboardDtos.DashboardSummary(
                projectRepository.count(),
                projectRepository.findAllByPublishedTrueOrderBySortOrderAscCreatedAtDesc().size(),
                projectRepository.findAll().stream().filter(p -> Boolean.TRUE.equals(p.getFeatured())).count(),
                likesPanel.totalLikes(),
                messageRepository.count(),
                messageRepository.countByReadFlagFalse(),
                recent,
                likesPanel.items().stream().limit(5).toList());
    }
}
