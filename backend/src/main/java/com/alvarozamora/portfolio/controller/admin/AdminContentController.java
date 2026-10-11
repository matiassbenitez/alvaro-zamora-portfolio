package com.alvarozamora.portfolio.controller.admin;

import com.alvarozamora.portfolio.dto.SiteDtos;
import com.alvarozamora.portfolio.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/content")
public class AdminContentController {

    private final ContentService contentService;

    @GetMapping
    public SiteDtos.SiteResponse get() {
        return contentService.getSite();
    }

    @PutMapping
    public SiteDtos.SiteResponse update(@Valid @RequestBody SiteDtos.SiteUpdateRequest request) {
        return contentService.updateSite(request);
    }
}
