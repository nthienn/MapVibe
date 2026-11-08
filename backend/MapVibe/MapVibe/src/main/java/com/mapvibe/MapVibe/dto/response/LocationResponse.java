package com.mapvibe.MapVibe.dto.response;

import com.mapvibe.MapVibe.entity.LocationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationResponse {
    Long id;
    String name;
    String slug;

    CategoryResponse category;

    ProvinceResponse province;
    WardResponse ward;
    String address;

    Double latitude;
    Double longitude;

    List<String> images;

    String description;

    String phone;
    String email;
    String website;
    String facebook;
    String instagram;
    String tiktok;

    List<AmenityResponse> amenities;
    List<OpeningHourResponse> openingHours;
    List<PricingCategoryResponse> pricingCategories;
    List<PricingItemResponse> pricingItems;
    List<PricingOrderResponse> pricingOrder;

    LocationStatus status;

    UserMinResponse user;

    Integer totalReviews = 0;
    Double averageRating = 0.0;

    boolean bookmarked;
    long bookmarkCount;
}
