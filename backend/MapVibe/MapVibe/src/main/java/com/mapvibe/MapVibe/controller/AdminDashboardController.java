package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.response.AdminDashboardResponse;
import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.service.AdminDashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminDashboardController {

    AdminDashboardService adminDashboardService;

    @GetMapping
    ApiResponse<AdminDashboardResponse> getDashboard() {
        return ApiResponse.<AdminDashboardResponse>builder()
                .result(adminDashboardService.getDashboard())
                .build();
    }
}
