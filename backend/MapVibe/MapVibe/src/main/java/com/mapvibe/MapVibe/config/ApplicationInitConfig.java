package com.mapvibe.MapVibe.config;

import com.mapvibe.MapVibe.entity.Role;
import com.mapvibe.MapVibe.entity.User;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.repository.RoleRepository;
import com.mapvibe.MapVibe.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    String ADMIN_AVATAR = "https://thumbs.dreamstime.com/b/admin-icon-vector-male-person-profile-avatar-gear-cogwheel-settings-configuration-flat-color-glyph-pictogram-150124023.jpg";

    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (!roleRepository.existsById("USER")) {
                roleRepository.save(Role.builder()
                        .name("USER")
                        .description("Default User Role")
                        .build());
                log.info("Default User role created successfully!");
            }

            if (!roleRepository.existsById("ADMIN")) {
                roleRepository.save(Role.builder()
                        .name("ADMIN")
                        .description("Administrator Role")
                        .build());

                log.info("Administrator role created successfully!");
            }

            if (!roleRepository.existsById("SUPER_ADMIN")) {
                roleRepository.save(Role.builder()
                        .name("SUPER_ADMIN")
                        .description("Super Administrator Role")
                        .build());

                log.info("Super Administrator role created successfully!");
            }

            String adminEmail = "admin@mapvibe.com";

            if (!userRepository.existsByEmail(adminEmail)) {
                Role adminRole = roleRepository.findById("ADMIN")
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

                Role superAdminRole = roleRepository.findById("SUPER_ADMIN")
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                roles.add(superAdminRole);

                User admin = User.builder()
                        .name("Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .avatar(ADMIN_AVATAR)
                        .roles(roles)
                        .build();

                userRepository.save(admin);
                log.warn("⚠️ Default SUPER_ADMIN account created successfully!");
            }
        };
    }
}
