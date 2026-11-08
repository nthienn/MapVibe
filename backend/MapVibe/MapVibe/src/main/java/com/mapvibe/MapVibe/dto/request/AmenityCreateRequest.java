package com.mapvibe.MapVibe.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AmenityCreateRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    String name;
}
