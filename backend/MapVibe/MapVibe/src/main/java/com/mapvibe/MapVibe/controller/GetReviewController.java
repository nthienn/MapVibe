package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.dto.response.UserReviewResponse;
import com.mapvibe.MapVibe.service.ReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GetReviewController {

    ReviewService reviewService;

    @GetMapping("/admin")
    public ApiResponse<PageResponse<UserReviewResponse>> getAdminReviews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ApiResponse.<PageResponse<UserReviewResponse>>builder()
                .result(reviewService.getAdminReviews(page, size))
                .build();
    }

    @GetMapping("/my-reviews")
    public ApiResponse<PageResponse<UserReviewResponse>> getMyReviews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ApiResponse.<PageResponse<UserReviewResponse>>builder()
                .result(reviewService.getMyReviews(page, size))
                .build();
    }
}
