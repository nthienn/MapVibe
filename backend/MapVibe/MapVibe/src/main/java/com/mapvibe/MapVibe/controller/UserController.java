package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.request.ChangePasswordRequest;
import com.mapvibe.MapVibe.dto.request.UserProfileUpdateRequest;
import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.UserProfileResponse;
import com.mapvibe.MapVibe.dto.response.UserResponse;
import com.mapvibe.MapVibe.service.UserProfileService;
import com.mapvibe.MapVibe.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;
    UserProfileService userProfileService;

    @GetMapping("/{id}")
    ApiResponse<UserResponse> getUser(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(id))
                .build();
    }

    @GetMapping("/my-profile")
    ApiResponse<UserResponse> getMyProfile() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyProfile())
                .build();
    }

    @PutMapping("/my-profile")
    ApiResponse<UserResponse> updateMyProfile(@RequestBody @Valid UserProfileUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateMyProfile(request))
                .build();
    }

    @PutMapping("/change-password")
    ApiResponse<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(request);

        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/{id}/profile")
    ApiResponse<UserProfileResponse> getUserProfile(
            @PathVariable String id,
            @RequestParam(defaultValue = "1") int listingsPage,
            @RequestParam(defaultValue = "6") int listingsSize,
            @RequestParam(defaultValue = "1") int reviewsPage,
            @RequestParam(defaultValue = "5") int reviewsSize
    ) {
        return ApiResponse.<UserProfileResponse>builder()
                .result(
                        userProfileService.getUserProfile(
                                id,
                                listingsPage,
                                listingsSize,
                                reviewsPage,
                                reviewsSize
                        )
                )
                .build();
    }
}
