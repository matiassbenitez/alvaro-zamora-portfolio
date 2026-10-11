package com.alvarozamora.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

public final class ProjectDtos {

    private ProjectDtos() {
    }

    public record ProjectRequest(
            @NotBlank(message = "El título es obligatorio") @Size(max = 160, message = "El título no puede superar 160 caracteres") String title,
            @Size(max = 180, message = "El slug no puede superar 180 caracteres") String slug,
            @NotBlank(message = "La categoría es obligatoria") @Size(max = 80, message = "La categoría no puede superar 80 caracteres") String category,
            Integer year,
            String description,
            @Size(max = 255, message = "La URL de la portada no puede superar 255 caracteres") String coverImage,
            Boolean featured,
            Boolean published,
            Integer sortOrder) {
    }

    public record ProjectSummary(
            Long id,
            String title,
            String slug,
            String category,
            Integer year,
            String coverImage,
            Boolean featured,
            Boolean published,
            Integer sortOrder,
            Integer likeCount,
            OffsetDateTime createdAt) {
    }

    public record ProjectDetail(
            Long id,
            String title,
            String slug,
            String category,
            Integer year,
            String description,
            String coverImage,
            Boolean featured,
            Boolean published,
            Integer sortOrder,
            Integer likeCount,
            OffsetDateTime createdAt,
            List<ProjectImageDto> images) {
    }

    public record ProjectImageDto(Long id, String url, Integer sortOrder) {
    }

    public record ImageRequest(
            @NotBlank(message = "La URL de la imagen es obligatoria") String imageUrl) {
    }

    public record FeaturedRequest(Boolean featured) {
    }

    public record OrderRequest(Integer sortOrder) {
    }
}
