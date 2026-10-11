package com.alvarozamora.portfolio.service;

import com.alvarozamora.portfolio.dto.DashboardDtos;
import com.alvarozamora.portfolio.dto.LikeDtos;
import com.alvarozamora.portfolio.entity.LikeRecord;
import com.alvarozamora.portfolio.entity.Project;
import com.alvarozamora.portfolio.exception.ApiException;
import com.alvarozamora.portfolio.repository.LikeRecordRepository;
import com.alvarozamora.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRecordRepository likeRecordRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public LikeDtos.LikeResponse like(Long projectId, String visitorToken, String ip) {
        Project project = projectRepository.findById(projectId)
                .filter(p -> Boolean.TRUE.equals(p.getPublished()))
                .orElseThrow(() -> ApiException.notFound("Proyecto no encontrado"));

        String token = visitorToken.trim();
        if (token.isEmpty()) {
            throw ApiException.badRequest("El token de visitante es obligatorio");
        }
        if (likeRecordRepository.existsByProjectIdAndVisitorToken(project.getId(), token)) {
            return new LikeDtos.LikeResponse(project.getId(), project.getLikeCount());
        }
        try {
            likeRecordRepository.save(LikeRecord.builder()
                    .projectId(project.getId())
                    .visitorToken(token)
                    .ipHash(ip == null ? null : sha256(ip))
                    .build());
            project.setLikeCount(project.getLikeCount() + 1);
            projectRepository.save(project);
        } catch (DataIntegrityViolationException e) {
            // otro request con el mismo token ganó la carrera: el like ya está registrado
            project = projectRepository.findById(projectId).orElse(project);
        }
        return new LikeDtos.LikeResponse(project.getId(), project.getLikeCount());
    }

    public DashboardDtos.LikesPanel likesPanel() {
        List<DashboardDtos.LikeRankingItem> items = projectRepository.findAllByOrderByLikeCountDesc().stream()
                .map(p -> new DashboardDtos.LikeRankingItem(p.getId(), p.getTitle(), p.getSlug(), p.getCoverImage(), p.getLikeCount()))
                .toList();
        long total = items.stream().mapToLong(DashboardDtos.LikeRankingItem::likeCount).sum();
        return new DashboardDtos.LikesPanel(total, items);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }
}
