package com.alvarozamora.portfolio.service;

import com.alvarozamora.portfolio.dto.DashboardDtos;
import com.alvarozamora.portfolio.dto.ProjectDtos;
import com.alvarozamora.portfolio.entity.Project;
import com.alvarozamora.portfolio.entity.ProjectImage;
import com.alvarozamora.portfolio.exception.ApiException;
import com.alvarozamora.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final StorageService storageService;

    public List<ProjectDtos.ProjectSummary> listAll() {
        return projectRepository.findAllByOrderBySortOrderAscCreatedAtDesc().stream()
                .map(this::toSummary)
                .toList();
    }

    public List<ProjectDtos.ProjectSummary> listPublished() {
        return projectRepository.findAllByPublishedTrueOrderBySortOrderAscCreatedAtDesc().stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDtos.ProjectDetail getDetail(Long id) {
        return toDetail(find(id));
    }

    @Transactional(readOnly = true)
    public ProjectDtos.ProjectDetail getBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> ApiException.notFound("Proyecto no encontrado"));
        if (!Boolean.TRUE.equals(project.getPublished())) {
            throw ApiException.notFound("Proyecto no encontrado");
        }
        return toDetail(project);
    }

    @Transactional
    public ProjectDtos.ProjectDetail create(ProjectDtos.ProjectRequest request) {
        String slug = resolveSlug(request.slug() != null && !request.slug().isBlank() ? request.slug() : request.title(), null);
        Project project = Project.builder()
                .title(request.title().trim())
                .slug(slug)
                .category(request.category().trim())
                .year(request.year())
                .description(request.description())
                .coverImage(blankToNull(request.coverImage()))
                .featured(Boolean.TRUE.equals(request.featured()))
                .published(request.published() == null || request.published())
                .sortOrder(request.sortOrder() == null ? 0 : request.sortOrder())
                .likeCount(0)
                .build();
        return toDetail(projectRepository.save(project));
    }

    @Transactional
    public ProjectDtos.ProjectDetail update(Long id, ProjectDtos.ProjectRequest request) {
        Project project = find(id);
        project.setTitle(request.title().trim());
        String desiredSlug = request.slug() != null && !request.slug().isBlank() ? request.slug() : request.title();
        project.setSlug(resolveSlug(desiredSlug, project.getId()));
        project.setCategory(request.category().trim());
        project.setYear(request.year());
        project.setDescription(request.description());
        if (request.coverImage() != null) {
            project.setCoverImage(blankToNull(request.coverImage()));
        }
        if (request.featured() != null) {
            project.setFeatured(request.featured());
        }
        if (request.published() != null) {
            project.setPublished(request.published());
        }
        if (request.sortOrder() != null) {
            project.setSortOrder(request.sortOrder());
        }
        return toDetail(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        Project project = find(id);
        storageService.deleteByUrl(project.getCoverImage());
        project.getImages().forEach(img -> storageService.deleteByUrl(img.getImageUrl()));
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectDtos.ProjectDetail addImage(Long projectId, ProjectDtos.ImageRequest request) {
        Project project = find(projectId);
        String url = request.imageUrl().trim();
        ProjectImage image = ProjectImage.builder()
                .project(project)
                .imageUrl(url)
                .sortOrder(project.getImages().size())
                .build();
        project.getImages().add(image);
        projectRepository.save(project);
        return toDetail(project);
    }

    @Transactional
    public ProjectDtos.ProjectDetail removeImage(Long projectId, Long imageId) {
        Project project = find(projectId);
        ProjectImage image = project.getImages().stream()
                .filter(i -> i.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Imagen no encontrada"));
        storageService.deleteByUrl(image.getImageUrl());
        project.getImages().remove(image);
        return toDetail(projectRepository.save(project));
    }

    @Transactional
    public ProjectDtos.ProjectDetail setCover(Long projectId, ProjectDtos.ImageRequest request) {
        Project project = find(projectId);
        storageService.deleteByUrl(project.getCoverImage());
        project.setCoverImage(request.imageUrl().trim());
        return toDetail(projectRepository.save(project));
    }

    @Transactional
    public ProjectDtos.ProjectSummary setFeatured(Long id, ProjectDtos.FeaturedRequest request) {
        Project project = find(id);
        project.setFeatured(Boolean.TRUE.equals(request.featured()));
        return toSummary(projectRepository.save(project));
    }

    @Transactional
    public ProjectDtos.ProjectSummary setSortOrder(Long id, ProjectDtos.OrderRequest request) {
        Project project = find(id);
        project.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        return toSummary(projectRepository.save(project));
    }

    public List<DashboardDtos.LikeRankingItem> rankingByLikes() {
        return projectRepository.findAllByOrderByLikeCountDesc().stream()
                .limit(10)
                .map(p -> new DashboardDtos.LikeRankingItem(p.getId(), p.getTitle(), p.getSlug(), p.getCoverImage(), p.getLikeCount()))
                .toList();
    }

    private Project find(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Proyecto no encontrado"));
    }

    private String resolveSlug(String source, Long currentId) {
        String base = slugify(source);
        if (base.isEmpty()) {
            base = "proyecto";
        }
        String slug = base;
        int suffix = 2;
        while (slugTaken(slug, currentId)) {
            slug = base + "-" + suffix++;
        }
        return slug;
    }

    private boolean slugTaken(String slug, Long currentId) {
        return currentId == null ? projectRepository.existsBySlug(slug)
                : projectRepository.existsBySlugAndIdNot(slug, currentId);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String slugify(String text) {
        String normalized = Normalizer.normalize(text == null ? "" : text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+|-+$)", "");
        return normalized;
    }

    private ProjectDtos.ProjectSummary toSummary(Project p) {
        return new ProjectDtos.ProjectSummary(
                p.getId(), p.getTitle(), p.getSlug(), p.getCategory(), p.getYear(),
                p.getCoverImage(), p.getFeatured(), p.getPublished(), p.getSortOrder(),
                p.getLikeCount(), p.getCreatedAt());
    }

    private ProjectDtos.ProjectDetail toDetail(Project p) {
        List<ProjectDtos.ProjectImageDto> images = p.getImages().stream()
                .map(i -> new ProjectDtos.ProjectImageDto(i.getId(), i.getImageUrl(), i.getSortOrder()))
                .toList();
        return new ProjectDtos.ProjectDetail(
                p.getId(), p.getTitle(), p.getSlug(), p.getCategory(), p.getYear(),
                p.getDescription(), p.getCoverImage(), p.getFeatured(), p.getPublished(),
                p.getSortOrder(), p.getLikeCount(), p.getCreatedAt(), images);
    }
}
