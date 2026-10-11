package com.alvarozamora.portfolio.controller.publicapi;

import com.alvarozamora.portfolio.dto.ServiceDtos;
import com.alvarozamora.portfolio.dto.SiteDtos;
import com.alvarozamora.portfolio.repository.ServiceEntityRepository;
import com.alvarozamora.portfolio.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public")
public class PublicSiteController {

    private final ContentService contentService;
    private final ServiceEntityRepository serviceEntityRepository;

    @GetMapping("/site")
    public SiteDtos.SiteResponse site() {
        return contentService.getSite();
    }

    @GetMapping("/services")
    public List<ServiceDtos.ServiceResponse> services() {
        return serviceEntityRepository.findAllByActiveTrueOrderBySortOrderAsc().stream()
                .map(s -> new ServiceDtos.ServiceResponse(
                        s.getId(), s.getTitle(), s.getDescription(), s.getIcon(), s.getSortOrder(), s.getActive()))
                .toList();
    }
}
