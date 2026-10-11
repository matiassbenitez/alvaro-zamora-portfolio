package com.alvarozamora.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "social_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String label;

    @Column(nullable = false, length = 300)
    private String url;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}
