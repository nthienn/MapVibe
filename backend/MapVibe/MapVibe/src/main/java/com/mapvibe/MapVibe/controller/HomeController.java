package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.LocationMinResponse;
import com.mapvibe.MapVibe.dto.response.PopularCategoryResponse;
import com.mapvibe.MapVibe.service.HomeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeController {

    HomeService homeService;

    @GetMapping("/init")
    public ApiResponse<Map<String, Object>> getHomePageData() {
        List<PopularCategoryResponse> categories = homeService.getPopularCategories(6);
        List<LocationMinResponse> locations = homeService.getPopularLocations(6);

        Map<String, Object> data = Map.of(
                "popularCategories", categories,
                "popularLocations", locations
        );

        return ApiResponse.<Map<String, Object>>builder()
                .result(data)
                .build();
    }
}
