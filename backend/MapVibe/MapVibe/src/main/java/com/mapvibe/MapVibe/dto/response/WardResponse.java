package com.mapvibe.MapVibe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WardResponse {
    String code;
    String name;
    String nameEn;
    String fullName;
    String fullNameEn;
    String codeName;
}
