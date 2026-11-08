package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.RoleCreateRequest;
import com.mapvibe.MapVibe.dto.request.RoleUpdateRequest;
import com.mapvibe.MapVibe.dto.response.RoleResponse;
import com.mapvibe.MapVibe.entity.Permission;
import com.mapvibe.MapVibe.entity.Role;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.RoleMapper;
import com.mapvibe.MapVibe.repository.PermissionRepository;
import com.mapvibe.MapVibe.repository.RoleRepository;
import com.mapvibe.MapVibe.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {

    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    UserRepository userRepository;
    RoleMapper roleMapper;

    private static final Set<String> SYSTEM_ROLES = Set.of("USER", "ADMIN", "SUPER_ADMIN");

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public RoleResponse create(RoleCreateRequest request) {
        String name = request.getName();

        // Reserve system role names.
        if (isSystemRole(name)) {
            throw new AppException(ErrorCode.SYSTEM_ROLE_RESERVED);
        }

        if (roleRepository.existsById(request.getName())) {
            throw new AppException(ErrorCode.ROLE_ALREADY_EXISTS);
        }

        Role role = roleMapper.toRole(request);

        List<Permission> permissions = permissionRepository.findAllById(request.getPermissions());

        role.setPermissions(new HashSet<>(permissions));

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleResponse> getAll() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public RoleResponse update(String name, RoleUpdateRequest request) {
        Role role = roleRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        // Keep the SUPER_ADMIN role definition protected.
        if ("SUPER_ADMIN".equals(role.getName())) {
            throw new AppException(ErrorCode.SYSTEM_ROLE_CANNOT_BE_MODIFIED);
        }

        roleMapper.updateRole(role, request);

        if (request.getPermissions() != null) {
            List<Permission> permissions = permissionRepository.findAllById(request.getPermissions());

            role.setPermissions(new HashSet<>(permissions));
        }

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public void delete(String name) {
        Role role = roleRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        // System roles must never be deleted.
        if (isSystemRole(role.getName())) {
            throw new AppException(ErrorCode.SYSTEM_ROLE_CANNOT_BE_DELETED);
        }

        // Do not delete a role that is assigned to any user.
        if (userRepository.countUsersByRoleName(role.getName()) > 0) {
            throw new AppException(ErrorCode.ROLE_IN_USE);
        }

        roleRepository.delete(role);
    }

    private boolean isSystemRole(String name) {
        return name != null && SYSTEM_ROLES.contains(name.trim().toUpperCase(Locale.ROOT));
    }
}
