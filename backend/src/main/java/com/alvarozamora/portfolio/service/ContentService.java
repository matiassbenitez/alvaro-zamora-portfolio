package com.alvarozamora.portfolio.service;

import com.alvarozamora.portfolio.dto.SiteDtos;
import com.alvarozamora.portfolio.entity.SiteContent;
import com.alvarozamora.portfolio.entity.SocialLink;
import com.alvarozamora.portfolio.exception.ApiException;
import com.alvarozamora.portfolio.repository.SiteContentRepository;
import com.alvarozamora.portfolio.repository.SocialLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final SiteContentRepository siteContentRepository;
    private final SocialLinkRepository socialLinkRepository;

    public SiteDtos.SiteResponse getSite() {
        SiteContent content = siteContentRepository.findById(SiteContent.SINGLETON_ID)
                .orElseGet(() -> SiteContent.builder().id(SiteContent.SINGLETON_ID).build());
        List<SiteDtos.SiteResponse.Social> socials = socialLinkRepository.findAllByOrderBySortOrderAsc().stream()
                .map(s -> new SiteDtos.SiteResponse.Social(s.getId(), s.getLabel(), s.getUrl()))
                .toList();
        return new SiteDtos.SiteResponse(
                content.getBrandName(),
                content.getBrandTagline(),
                content.getLogoText(),
                new SiteDtos.SiteResponse.Hero(content.getHeroTitle(), content.getHeroSubtitle(), content.getHeroImage()),
                new SiteDtos.SiteResponse.About(content.getAboutTitle(), content.getAboutText(), content.getAboutImage()),
                new SiteDtos.SiteResponse.Contact(content.getContactEmail(), content.getContactPhone(), content.getContactLocation()),
                content.getFooterText(),
                socials);
    }

    @Transactional
    public SiteDtos.SiteResponse updateSite(SiteDtos.SiteUpdateRequest request) {
        SiteContent content = siteContentRepository.findById(SiteContent.SINGLETON_ID)
                .orElseGet(() -> SiteContent.builder().id(SiteContent.SINGLETON_ID).build());

        content.setBrandName(request.brandName());
        content.setBrandTagline(request.brandTagline());
        content.setLogoText(request.logoText());
        if (request.hero() != null) {
            content.setHeroTitle(request.hero().title());
            content.setHeroSubtitle(request.hero().subtitle());
            if (request.hero().image() != null) {
                content.setHeroImage(request.hero().image());
            }
        }
        if (request.about() != null) {
            content.setAboutTitle(request.about().title());
            content.setAboutText(request.about().text());
            if (request.about().image() != null) {
                content.setAboutImage(request.about().image());
            }
        }
        if (request.contact() != null) {
            content.setContactEmail(request.contact().email());
            content.setContactPhone(request.contact().phone());
            content.setContactLocation(request.contact().location());
        }
        content.setFooterText(request.footerText());
        siteContentRepository.save(content);

        if (request.socials() != null) {
            List<SocialLink> existing = new ArrayList<>(socialLinkRepository.findAll());
            socialLinkRepository.deleteAll(existing);
            socialLinkRepository.flush();
            List<SocialLink> updated = new ArrayList<>();
            int order = 0;
            for (SiteDtos.SiteUpdateRequest.SocialUpdate s : request.socials()) {
                if (s.label() == null || s.label().isBlank() || s.url() == null || s.url().isBlank()) {
                    continue;
                }
                updated.add(SocialLink.builder()
                        .label(s.label().trim())
                        .url(s.url().trim())
                        .sortOrder(order++)
                        .build());
            }
            socialLinkRepository.saveAll(updated);
        }
        return getSite();
    }
}
