package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.UserRoleUpdateRequest;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.dto.response.UserResponse;
import com.mapvibe.MapVibe.entity.Role;
import com.mapvibe.MapVibe.entity.User;
import com.mapvibe.MapVibe.entity.UserStatus;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.UserMapper;
import com.mapvibe.MapVibe.repository.RoleRepository;
import com.mapvibe.MapVibe.repository.UserRepository;
import com.mapvibe.MapVibe.security.CurrentUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminUserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    CurrentUserService currentUserService;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("createdAt").descending()
        );

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        Page<User> userPage = (cleanKeyword != null)
                ? userRepository.searchUsers(cleanKeyword, pageable)
                : userRepository.findAll(pageable);

        List<UserResponse> data = userPage.getContent()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .pageSize(userPage.getSize())
                .data(data)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public UserResponse updateUserRoles(String id, UserRoleUpdateRequest request) {
        User currentUser = currentUserService.getUser();

        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Không cho phép tự thay đổi role của chính mình.
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new AppException(ErrorCode.CANNOT_UPDATE_OWN_ROLE);
        }

        // Không cho phép thay đổi role của tài khoản SUPER_ADMIN gốc.
        if (hasRole(targetUser, "SUPER_ADMIN")) {
            throw new AppException(ErrorCode.CANNOT_MODIFY_SUPER_ADMIN);
        }

        Set<String> requestedRoleNames = request.getRoles();

        // Kiểm tra các role được yêu cầu có tồn tại hay không.
        List<Role> requestedRoles = roleRepository.findAllById(requestedRoleNames);

        Set<String> foundRoleNames = requestedRoles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        if (!foundRoleNames.equals(requestedRoleNames)) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        }

        // SUPER_ADMIN chỉ được gán cho tài khoản gốc qua bootstrap.
        if (requestedRoleNames.contains("SUPER_ADMIN")) {
            throw new AppException(ErrorCode.CANNOT_ASSIGN_SUPER_ADMIN);
        }

        boolean currentIsSuperAdmin = hasRole(currentUser, "SUPER_ADMIN");

        boolean targetIsAdmin = hasRole(targetUser, "ADMIN");
        boolean requestedAdmin = requestedRoleNames.contains("ADMIN");

        // Admin thông thường không được thay đổi role của Admin khác.
        if (!currentIsSuperAdmin && targetIsAdmin) {
            throw new AppException(ErrorCode.ONLY_SUPER_ADMIN_CAN_MANAGE_ADMIN);
        }

        // Chỉ SUPER_ADMIN mới được cấp role ADMIN.
        if (!currentIsSuperAdmin && requestedAdmin) {
            throw new AppException(ErrorCode.ONLY_SUPER_ADMIN_CAN_ASSIGN_ADMIN);
        }

        // Không cho phép hạ quyền Admin cuối cùng.
        if (targetIsAdmin
                && !requestedAdmin
                && userRepository.countUsersByRoleName("ADMIN") <= 1
        ) {
            throw new AppException(ErrorCode.CANNOT_REMOVE_LAST_ADMIN);
        }

        targetUser.setRoles(new HashSet<>(requestedRoles));

        return userMapper.toUserResponse(userRepository.save(targetUser));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public UserResponse suspendUser(String id) {
        User currentUser = currentUserService.getUser();

        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Không cho phép tự khóa tài khoản.
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new AppException(ErrorCode.CANNOT_SUSPEND_SELF);
        }

        // Bảo vệ tài khoản Super Admin.
        if (hasRole(targetUser, "SUPER_ADMIN")) {
            throw new AppException(ErrorCode.CANNOT_MODIFY_SUPER_ADMIN);
        }

        // Gọi lại API không làm thay đổi dữ liệu đã đúng trạng thái.
        if (targetUser.getStatus() == UserStatus.SUSPENDED) {
            return userMapper.toUserResponse(targetUser);
        }

        targetUser.setStatus(UserStatus.SUSPENDED);

        return userMapper.toUserResponse(userRepository.save(targetUser));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public UserResponse reactivateUser(String id) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Bảo vệ tài khoản Super Admin.
        if (hasRole(targetUser, "SUPER_ADMIN")) {
            throw new AppException(ErrorCode.CANNOT_MODIFY_SUPER_ADMIN);
        }

        // Gọi lại API không làm thay đổi dữ liệu đã đúng trạng thái.
        if (targetUser.getStatus() == UserStatus.ACTIVE) {
            return userMapper.toUserResponse(targetUser);
        }

        targetUser.setStatus(UserStatus.ACTIVE);

        return userMapper.toUserResponse(userRepository.save(targetUser));
    }

    private boolean hasRole(User user, String roleName) {
        return user.getRoles() != null
                && user.getRoles().stream()
                .anyMatch(role ->
                        roleName.equals(role.getName()));
    }
}
