package com.mapvibe.MapVibe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationSuggestionResponse {
    Long id;
    String name;
    String slug;
    String address;
    ProvinceResponse province;
    WardResponse ward;
    Double latitude;
    Double longitude;
}
