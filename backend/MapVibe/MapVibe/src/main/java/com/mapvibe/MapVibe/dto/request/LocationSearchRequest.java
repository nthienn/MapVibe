package com.mapvibe.MapVibe.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationSearchRequest {
    Integer page = 1;
    Integer size = 6;
    String keyword;
    String category;
    Long locationId;
    Double radius;
    List<Long> amenityIds = new ArrayList<>();
    String sort = "default";
}
