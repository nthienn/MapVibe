package com.mapvibe.MapVibe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminDashboardResponse {
    long totalUsers;
    long totalListings;
    long totalReviews;
    long totalCategories;
    long totalBookmarks;
    long totalAmenities;
    long totalRoles;
    long totalPermissions;
}
