package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.request.PermissionCreateRequest;
import com.mapvibe.MapVibe.dto.request.PermissionUpdateRequest;
import com.mapvibe.MapVibe.dto.response.PermissionResponse;
import com.mapvibe.MapVibe.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionCreateRequest request);

    PermissionResponse toPermissionResponse(Permission permission);

    @Mapping(target = "name", ignore = true)
    void updatePermission(@MappingTarget Permission permission, PermissionUpdateRequest request);
}
