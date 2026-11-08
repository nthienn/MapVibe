package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.request.ReviewCreateRequest;
import com.mapvibe.MapVibe.dto.request.ReviewUpdateRequest;
import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.dto.response.ReviewResponse;
import com.mapvibe.MapVibe.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locations/{locationId}/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {

    ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(
            @PathVariable Long locationId,
            @Valid @RequestBody ReviewCreateRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(locationId, request))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<ReviewResponse>> getReviews(
            @PathVariable Long locationId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ApiResponse.<PageResponse<ReviewResponse>>builder()
                .result(reviewService.getReviews(locationId, page, size))
                .build();
    }

    @PutMapping("/{reviewId}")
    public ApiResponse<ReviewResponse> updateReview(
            @PathVariable Long locationId,
            @PathVariable String reviewId,
            @Valid @RequestBody ReviewUpdateRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.updateReview(locationId, reviewId, request))
                .build();
    }

    @DeleteMapping("/{reviewId}")
    public ApiResponse<String> deleteReview(@PathVariable Long locationId, @PathVariable String reviewId) {
        reviewService.deleteReview(locationId, reviewId);

        return ApiResponse.<String>builder()
                .message("Review deleted successfully!")
                .build();
    }
}
