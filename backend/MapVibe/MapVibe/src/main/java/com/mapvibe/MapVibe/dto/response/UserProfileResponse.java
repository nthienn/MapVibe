package com.mapvibe.MapVibe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    UserMinResponse user;
    PageResponse<LocationMinResponse> listings;
    PageResponse<UserReviewResponse> reviews;
    Double averageRating;
}
