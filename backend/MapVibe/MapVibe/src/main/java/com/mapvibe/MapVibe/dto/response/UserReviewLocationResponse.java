package com.mapvibe.MapVibe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserReviewLocationResponse {
    Long id;
    String name;
    String slug;
    ProvinceResponse province;
    WardResponse ward;
    String address;
    List<String> images;
}
