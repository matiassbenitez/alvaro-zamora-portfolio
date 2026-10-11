package com.alvarozamora.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "site_content")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteContent {

    public static final Long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    @Column(name = "brand_name", nullable = false, length = 120)
    private String brandName;

    @Column(name = "brand_tagline", nullable = false, length = 160)
    private String brandTagline;

    @Column(name = "logo_text", nullable = false, length = 20)
    private String logoText;

    @Column(name = "hero_title", nullable = false, length = 160)
    private String heroTitle;

    @Column(name = "hero_subtitle", nullable = false, length = 300)
    private String heroSubtitle;

    @Column(name = "hero_image", length = 255)
    private String heroImage;

    @Column(name = "about_title", length = 160)
    private String aboutTitle;

    @Column(name = "about_text")
    private String aboutText;

    @Column(name = "about_image", length = 255)
    private String aboutImage;

    @Column(name = "contact_email", length = 160)
    private String contactEmail;

    @Column(name = "contact_phone", length = 60)
    private String contactPhone;

    @Column(name = "contact_location", length = 160)
    private String contactLocation;

    @Column(name = "footer_text", length = 300)
    private String footerText;
}
