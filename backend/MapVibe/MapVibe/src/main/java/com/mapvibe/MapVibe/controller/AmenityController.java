package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.request.AmenityCreateRequest;
import com.mapvibe.MapVibe.dto.request.AmenityUpdateRequest;
import com.mapvibe.MapVibe.dto.response.AmenityResponse;
import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.service.AmenityService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AmenityController {

    AmenityService amenityService;

    @PostMapping
    ApiResponse<AmenityResponse> createAmenity(@RequestBody @Valid AmenityCreateRequest request) {
        return ApiResponse.<AmenityResponse>builder()
                .result(amenityService.createAmenity(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<AmenityResponse>> getAmenities() {
        return ApiResponse.<List<AmenityResponse>>builder()
                .result(amenityService.getAmenities())
                .build();
    }

    @GetMapping("/admin")
    ApiResponse<PageResponse<AmenityResponse>> getAdminAmenities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ApiResponse.<PageResponse<AmenityResponse>>builder()
                .result(amenityService.getAdminAmenities(page, size))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<AmenityResponse> updateAmenity(@PathVariable Long id, @RequestBody @Valid AmenityUpdateRequest request) {
        return ApiResponse.<AmenityResponse>builder()
                .result(amenityService.updateAmenity(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);

        return ApiResponse.<String>builder()
                .result("Amenity deleted successfully!")
                .build();
    }
}
