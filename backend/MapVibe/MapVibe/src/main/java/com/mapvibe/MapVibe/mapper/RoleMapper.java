package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.request.RoleCreateRequest;
import com.mapvibe.MapVibe.dto.request.RoleUpdateRequest;
import com.mapvibe.MapVibe.dto.response.RoleResponse;
import com.mapvibe.MapVibe.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleCreateRequest request);

    RoleResponse toRoleResponse(Role role);

    @Mapping(target = "name", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    void updateRole(@MappingTarget Role role, RoleUpdateRequest request);
}
