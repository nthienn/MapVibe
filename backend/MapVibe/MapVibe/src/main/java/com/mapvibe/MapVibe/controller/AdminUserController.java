package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.request.UserRoleUpdateRequest;
import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.dto.response.UserResponse;
import com.mapvibe.MapVibe.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminUserController {

    AdminUserService adminUserService;

    @GetMapping
    ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(adminUserService.getUsers(page, size, keyword))
                .build();
    }

    @PutMapping("/{id}/roles")
    ApiResponse<UserResponse> updateUserRoles(
            @PathVariable String id,
            @Valid @RequestBody UserRoleUpdateRequest request
    ) {
        return ApiResponse.<UserResponse>builder()
                .result(adminUserService.updateUserRoles(id, request))
                .build();
    }

    @PatchMapping("/{id}/suspend")
    ApiResponse<UserResponse> suspendUser(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(adminUserService.suspendUser(id))
                .build();
    }

    @PatchMapping("/{id}/reactivate")
    ApiResponse<UserResponse> reactivateUser(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(adminUserService.reactivateUser(id))
                .build();
    }
}
