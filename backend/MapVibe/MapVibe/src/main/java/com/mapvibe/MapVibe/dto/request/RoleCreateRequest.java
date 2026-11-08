package com.mapvibe.MapVibe.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleCreateRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    String name;

    String description;
    Set<String> permissions;
}
