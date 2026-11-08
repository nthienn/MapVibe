package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.request.UserCreateRequest;
import com.mapvibe.MapVibe.dto.request.UserProfileUpdateRequest;
import com.mapvibe.MapVibe.dto.response.UserMinResponse;
import com.mapvibe.MapVibe.dto.response.UserResponse;
import com.mapvibe.MapVibe.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);

    UserResponse toUserResponse(User user);

    UserMinResponse toUserMinResponse(User user);

    void updateProfile(@MappingTarget User user, UserProfileUpdateRequest request);
}
