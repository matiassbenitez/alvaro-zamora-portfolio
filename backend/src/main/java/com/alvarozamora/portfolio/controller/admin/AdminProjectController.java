package com.alvarozamora.portfolio.controller.admin;

import com.alvarozamora.portfolio.dto.ProjectDtos;
import com.alvarozamora.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectDtos.ProjectSummary> list() {
        return projectService.listAll();
    }

    @GetMapping("/{id}")
    public ProjectDtos.ProjectDetail get(@PathVariable Long id) {
        return projectService.getDetail(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDtos.ProjectDetail create(@Valid @RequestBody ProjectDtos.ProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    public ProjectDtos.ProjectDetail update(@PathVariable Long id, @Valid @RequestBody ProjectDtos.ProjectRequest request) {
        return projectService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }

    @PatchMapping("/{id}/featured")
    public ProjectDtos.ProjectSummary setFeatured(@PathVariable Long id, @Valid @RequestBody ProjectDtos.FeaturedRequest request) {
        return projectService.setFeatured(id, request);
    }

    @PatchMapping("/{id}/order")
    public ProjectDtos.ProjectSummary setSortOrder(@PathVariable Long id, @Valid @RequestBody ProjectDtos.OrderRequest request) {
        return projectService.setSortOrder(id, request);
    }

    @PatchMapping("/{id}/cover")
    public ProjectDtos.ProjectDetail setCover(@PathVariable Long id, @Valid @RequestBody ProjectDtos.ImageRequest request) {
        return projectService.setCover(id, request);
    }

    @PostMapping("/{id}/images")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDtos.ProjectDetail addImage(@PathVariable Long id, @Valid @RequestBody ProjectDtos.ImageRequest request) {
        return projectService.addImage(id, request);
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ProjectDtos.ProjectDetail removeImage(@PathVariable Long id, @PathVariable Long imageId) {
        return projectService.removeImage(id, imageId);
    }
}
