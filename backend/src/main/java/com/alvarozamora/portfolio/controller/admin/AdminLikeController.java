package com.alvarozamora.portfolio.controller.admin;

import com.alvarozamora.portfolio.dto.DashboardDtos;
import com.alvarozamora.portfolio.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/likes")
public class AdminLikeController {

    private final LikeService likeService;

    @GetMapping
    public DashboardDtos.LikesPanel panel() {
        return likeService.likesPanel();
    }
}
