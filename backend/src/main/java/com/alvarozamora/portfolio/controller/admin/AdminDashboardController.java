package com.alvarozamora.portfolio.controller.admin;

import com.alvarozamora.portfolio.dto.DashboardDtos;
import com.alvarozamora.portfolio.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardDtos.DashboardSummary summary() {
        return dashboardService.summary();
    }
}
