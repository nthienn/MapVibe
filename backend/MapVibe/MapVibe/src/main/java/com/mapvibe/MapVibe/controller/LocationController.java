package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.request.LocationCreateRequest;
import com.mapvibe.MapVibe.dto.request.LocationSearchRequest;
import com.mapvibe.MapVibe.dto.request.LocationUpdateRequest;
import com.mapvibe.MapVibe.dto.response.*;
import com.mapvibe.MapVibe.entity.LocationStatus;
import com.mapvibe.MapVibe.service.LocationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationController {

    LocationService locationService;

    @PostMapping
    ApiResponse<LocationResponse> createLocation(@RequestBody @Valid LocationCreateRequest request) {
        return ApiResponse.<LocationResponse>builder()
                .result(locationService.createLocation(request))
                .build();
    }

    @GetMapping
    ApiResponse<PageResponse<LocationMinResponse>> getLocations(LocationSearchRequest request) {
        return ApiResponse.<PageResponse<LocationMinResponse>>builder()
                .result(locationService.getLocations(request))
                .build();
    }

    @GetMapping("/suggestions")
    public ApiResponse<List<LocationSuggestionResponse>> getLocationSuggestions(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "8") int size
    ) {
        return ApiResponse.<List<LocationSuggestionResponse>>builder()
                .result(locationService.getLocationSuggestions(keyword, size))
                .build();
    }

    @GetMapping("/{slug}")
    ApiResponse<LocationResponse> getLocation(@PathVariable String slug) {
        return ApiResponse.<LocationResponse>builder()
                .result(locationService.getLocation(slug))
                .build();
    }

    @GetMapping("/id/{id}")
    ApiResponse<LocationResponse> getLocationById(@PathVariable Long id) {
        return ApiResponse.<LocationResponse>builder()
                .result(locationService.getLocationById(id))
                .build();
    }

    @GetMapping("/my-listings")
    public ApiResponse<PageResponse<LocationMinResponse>> getMyListings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) LocationStatus status
    ) {
        return ApiResponse.<PageResponse<LocationMinResponse>>builder()
                .result(locationService.getMyListings(page, size, status))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<LocationResponse> updateLocation(
            @PathVariable Long id,
            @RequestBody @Valid LocationUpdateRequest request) {
        return ApiResponse.<LocationResponse>builder()
                .result(locationService.updateLocation(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);

        return ApiResponse.<String>builder()
                .result("Location deleted successfully!")
                .build();
    }
}
