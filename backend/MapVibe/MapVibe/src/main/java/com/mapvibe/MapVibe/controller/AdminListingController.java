package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.LocationMinResponse;
import com.mapvibe.MapVibe.dto.response.LocationResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.entity.LocationStatus;
import com.mapvibe.MapVibe.service.AdminListingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/listings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminListingController {

    AdminListingService adminListingService;

    @GetMapping
    ApiResponse<PageResponse<LocationMinResponse>> getListings(
            @RequestParam LocationStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ApiResponse.<PageResponse<LocationMinResponse>>builder()
                .result(adminListingService.getListings(status, page, size))
                .build();
    }

    @GetMapping("/status-counts")
    ApiResponse<Map<String, Long>> getListingStatusCounts() {
        return ApiResponse.<Map<String, Long>>builder()
                .result(adminListingService.getListingStatusCounts())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<LocationResponse> getListing(@PathVariable Long id) {
        return ApiResponse.<LocationResponse>builder()
                .result(adminListingService.getListing(id))
                .build();
    }

    @PatchMapping("/{id}/approve")
    ApiResponse<LocationResponse> approveListing(@PathVariable Long id) {
        return ApiResponse.<LocationResponse>builder()
                .result(adminListingService.approveListing(id))
                .build();
    }

    @PatchMapping("/{id}/reject")
    ApiResponse<LocationResponse> rejectListing(@PathVariable Long id) {
        return ApiResponse.<LocationResponse>builder()
                .result(adminListingService.rejectListing(id))
                .build();
    }

    @PatchMapping("/{id}/deactivate")
    ApiResponse<LocationResponse> deactivateListing(@PathVariable Long id) {
        return ApiResponse.<LocationResponse>builder()
                .result(adminListingService.deactivateListing(id))
                .build();
    }

    @PatchMapping("/{id}/reactivate")
    ApiResponse<LocationResponse> reactivateListing(@PathVariable Long id) {
        return ApiResponse.<LocationResponse>builder()
                .result(adminListingService.reactivateListing(id))
                .build();
    }
}
