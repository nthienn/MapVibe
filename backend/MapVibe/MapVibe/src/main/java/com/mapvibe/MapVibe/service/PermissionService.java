package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.PermissionCreateRequest;
import com.mapvibe.MapVibe.dto.request.PermissionUpdateRequest;
import com.mapvibe.MapVibe.dto.response.PermissionResponse;
import com.mapvibe.MapVibe.entity.Permission;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.PermissionMapper;
import com.mapvibe.MapVibe.repository.PermissionRepository;
import com.mapvibe.MapVibe.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {

    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    RoleRepository roleRepository;

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public PermissionResponse create(PermissionCreateRequest request) {
        if (permissionRepository.existsById(request.getName())) {
            throw new AppException(ErrorCode.PERMISSION_ALREADY_EXISTS);
        }

        Permission permission = permissionMapper.toPermission(request);

        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAll() {
        return permissionRepository.findAll()
                .stream()
                .map(permissionMapper::toPermissionResponse)
                .toList();
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public PermissionResponse update(String name, PermissionUpdateRequest request) {
        Permission permission = permissionRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));

        permissionMapper.updatePermission(permission, request);

        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public void delete(String name) {
        Permission permission = permissionRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));

        if (roleRepository.countRolesByPermissionName(name) > 0) {
            throw new AppException(ErrorCode.PERMISSION_IN_USE);
        }

        permissionRepository.delete(permission);
    }
}
