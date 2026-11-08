package com.mapvibe.MapVibe.dto.response;

import com.mapvibe.MapVibe.entity.UserStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String name;
    String email;
    String avatar;
    Set<RoleResponse> roles;
    LocalDateTime createdAt;
    UserStatus status;
}
