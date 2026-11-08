package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.ChangePasswordRequest;
import com.mapvibe.MapVibe.dto.request.UserCreateRequest;
import com.mapvibe.MapVibe.dto.request.UserProfileUpdateRequest;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    MediaService mediaService;
    CurrentUserService currentUserService;

    String DEFAULT_AVATAR = "https://secure.gravatar.com/avatar/984b55e34aa3bd7513b190f8409e3e3b?s=120&d=mm&r=g";

    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatar(DEFAULT_AVATAR);
        user.setStatus(UserStatus.ACTIVE);

        Role defaultRole = roleRepository.findById("USER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        Set<Role> roles = new HashSet<>();
        roles.add(defaultRole);
        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('USER')")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public UserResponse getMyProfile() {
        User user = currentUserService.getUser();

        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public UserResponse updateMyProfile(UserProfileUpdateRequest request) {
        User user = currentUserService.getUser();

        String oldAvatar = user.getAvatar();
        String newAvatar = request.getAvatar();

        userMapper.updateProfile(user, request);

        if (newAvatar != null && !newAvatar.equals(oldAvatar)) {
            if (oldAvatar != null && !oldAvatar.equals(DEFAULT_AVATAR)) {
                mediaService.deleteImageFromCloudinary(oldAvatar);
            }
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUserService.getUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.CURRENT_PASSWORD_INCORRECT);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}
