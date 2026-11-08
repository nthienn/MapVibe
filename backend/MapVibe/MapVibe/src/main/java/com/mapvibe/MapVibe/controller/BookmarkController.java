package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.BookmarkResponse;
import com.mapvibe.MapVibe.dto.response.LocationMinResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.service.BookmarkService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookmarkController {

    BookmarkService bookmarkService;

    @PostMapping("/toggle/{locationId}")
    public ApiResponse<BookmarkResponse> toggleBookmark(@PathVariable Long locationId) {
        return ApiResponse.<BookmarkResponse>builder()
                .result(bookmarkService.toggleBookmark(locationId))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<LocationMinResponse>> getMyBookmarkedLocations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ApiResponse.<PageResponse<LocationMinResponse>>builder()
                .result(bookmarkService.getMyBookmarkedLocations(page, size))
                .build();
    }
}
