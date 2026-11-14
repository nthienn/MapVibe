package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.entity.EmailVerificationToken;
import com.mapvibe.MapVibe.entity.User;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.repository.EmailVerificationTokenRepository;
import com.mapvibe.MapVibe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    static final int TOKEN_EXPIRATION_MINUTES = 15;

    static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Transactional
    public void sendVerificationEmail(User user) {
        if (user.isEmailVerified()) {
            return;
        }

        // Xóa token xác thực cũ nếu còn tồn tại
        tokenRepository.deleteByUser_Id(user.getId());

        // Tạo token mới
        String rawToken = generateToken();

        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .tokenHash(hashToken(rawToken))
                .expiresAt(LocalDateTime.now().plusMinutes(TOKEN_EXPIRATION_MINUTES))
                .build();

        tokenRepository.save(verificationToken);

        // Tạo đường dẫn xác thực
        String baseUrl = frontendUrl.endsWith("/")
                ? frontendUrl.substring(0, frontendUrl.length() - 1)
                : frontendUrl;

        String verificationLink = baseUrl + "/verify-email?token=" + rawToken;

        // Gửi email
        String htmlContent = """
                <html>
                    <body>
                        <h2>Welcome to MapVibe!</h2>
                
                        <p>Thank you for creating a MapVibe account.</p>
                
                        <p>Please click the button below to verify your email address:</p>
                
                        <a href="%s"
                           style="
                               display: inline-block;
                               padding: 12px 20px;
                               background-color: #2563eb;
                               color: white;
                               text-decoration: none;
                               border-radius: 6px;
                           ">
                            Verify Email
                        </a>
                
                        <p>This link will expire in 15 minutes.</p>
                
                        <p>If you did not create this account, please ignore this email.</p>
                    </body>
                </html>
                """.formatted(verificationLink);

        emailService.sendHtmlEmail(
                user.getEmail(),
                "Verify your MapVibe account",
                htmlContent
        );
    }

    @Transactional
    public String verifyEmail(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new AppException(ErrorCode.INVALID_EMAIL_VERIFICATION_TOKEN);
        }

        String tokenHash = hashToken(rawToken);

        EmailVerificationToken verificationToken = tokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_EMAIL_VERIFICATION_TOKEN));

        // Kiểm tra token đã sử dụng chưa
        if (verificationToken.getUsedAt() != null) {
            throw new AppException(ErrorCode.INVALID_EMAIL_VERIFICATION_TOKEN);
        }

        // Kiểm tra thời hạn
        LocalDateTime now = LocalDateTime.now();

        if (!verificationToken.getExpiresAt().isAfter(now)) {
            throw new AppException(ErrorCode.EMAIL_VERIFICATION_TOKEN_EXPIRED);
        }

        // Xác thực email
        User user = verificationToken.getUser();
        user.setEmailVerified(true);

        verificationToken.setUsedAt(now);

        userRepository.save(user);
        tokenRepository.save(verificationToken);

        return user.getEmail();
    }

    // Email không tồn tại: không thực hiện gì.
    // Email đã xác thực: không gửi lại.
    // Email chưa xác thực: xóa token cũ và gửi email mới.
    @Transactional
    public void resendVerificationEmail(String email) {
        userRepository.findByEmail(email)
                .filter(user -> !user.isEmailVerified())
                .ifPresent(this::sendVerificationEmail);
    }

    private String generateToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm is not available.", e);
        }
    }
}
