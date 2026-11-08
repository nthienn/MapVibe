package com.mapvibe.MapVibe.dto.response;

import com.mapvibe.MapVibe.entity.LocationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationMinResponse {
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

    Integer totalReviews = 0;
    Double averageRating = 0.0;

    List<OpeningHourResponse> openingHours;

    boolean bookmarked;

    LocalDateTime createdAt;

    LocationStatus status;
}
