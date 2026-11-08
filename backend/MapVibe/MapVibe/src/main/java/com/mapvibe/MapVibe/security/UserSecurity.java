package com.mapvibe.MapVibe.security;

import com.mapvibe.MapVibe.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component("userSecurity")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserSecurity {
    UserRepository userRepository;
    CurrentUserService currentUserService;

    public boolean isOwner(String userId) {
        return userRepository.findById(userId)
                .map(user -> user.getEmail().equals(currentUserService.getEmail()))
                .orElse(false);
    }
}
