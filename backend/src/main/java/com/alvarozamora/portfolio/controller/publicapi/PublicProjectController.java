package com.alvarozamora.portfolio.controller.publicapi;

import com.alvarozamora.portfolio.dto.LikeDtos;
import com.alvarozamora.portfolio.dto.ProjectDtos;
import com.alvarozamora.portfolio.service.LikeService;
import com.alvarozamora.portfolio.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/projects")
public class PublicProjectController {

    private final ProjectService projectService;
    private final LikeService likeService;

    @GetMapping
    public List<ProjectDtos.ProjectSummary> list() {
        return projectService.listPublished();
    }

    @GetMapping("/{slug}")
    public ProjectDtos.ProjectDetail bySlug(@PathVariable String slug) {
        return projectService.getBySlug(slug);
    }

    @PostMapping("/{id}/like")
    public LikeDtos.LikeResponse like(@PathVariable Long id,
                                      @Valid @RequestBody LikeDtos.LikeRequest request,
                                      HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        return likeService.like(id, request.visitorToken(), ip);
    }
}
