package com.alvarozamora.portfolio.dto;

import java.util.List;

public final class DashboardDtos {

    private DashboardDtos() {
    }

    public record DashboardSummary(
            long totalProjects,
            long publishedProjects,
            long featuredProjects,
            long totalLikes,
            long totalMessages,
            long unreadMessages,
            List<MessageDtos.MessageResponse> recentMessages,
            List<LikeRankingItem> topLikes) {
    }

    public record LikeRankingItem(
            Long projectId,
            String title,
            String slug,
            String coverImage,
            int likeCount) {
    }

    public record LikesPanel(
            long totalLikes,
            List<LikeRankingItem> items) {
    }
}
