package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.request.*;
import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.AuthenticationResponse;
import com.mapvibe.MapVibe.dto.response.UserResponse;
import com.mapvibe.MapVibe.service.AuthenticationService;
import com.mapvibe.MapVibe.service.EmailVerificationService;
import com.mapvibe.MapVibe.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;
    UserService userService;
    EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody @Valid UserCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);

        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/verify-email")
    public ApiResponse<String> verifyEmail(@RequestBody @Valid VerifyEmailRequest request) {
        return ApiResponse.<String>builder()
                .result(emailVerificationService.verifyEmail(request.getToken()))
                .build();
    }

    @PostMapping("/resend-verification")
    public ApiResponse<String> resendVerificationEmail(@RequestBody @Valid ResendVerificationRequest request) {
        emailVerificationService.resendVerificationEmail(request.getEmail());

        return ApiResponse.<String>builder()
                .result("If the account exists and is not verified, a verification email has been sent.")
                .build();
    }
}
