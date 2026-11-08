package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.response.AdminDashboardResponse;
import com.mapvibe.MapVibe.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminDashboardService {

    UserRepository userRepository;
    LocationRepository locationRepository;
    ReviewRepository reviewRepository;
    CategoryRepository categoryRepository;
    BookmarkRepository bookmarkRepository;
    AmenityRepository amenityRepository;
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardResponse getDashboard() {
        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalListings(locationRepository.count())
                .totalReviews(reviewRepository.count())
                .totalCategories(categoryRepository.count())
                .totalBookmarks(bookmarkRepository.count())
                .totalAmenities(amenityRepository.count())
                .totalRoles(roleRepository.count())
                .totalPermissions(permissionRepository.count())
                .build();
    }
}
