package com.mapvibe.MapVibe.dto.response;

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
public class UserReviewResponse {
    String id;
    UserMinResponse user;
    UserReviewLocationResponse location;
    int rating;
    String content;
    List<String> images;
    LocalDateTime createdAt;
}
