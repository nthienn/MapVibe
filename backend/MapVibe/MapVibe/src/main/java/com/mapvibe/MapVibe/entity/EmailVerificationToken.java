package com.mapvibe.MapVibe.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(nullable = false, unique = true)
    String tokenHash;

    @Column(nullable = false)
    LocalDateTime expiresAt;

    LocalDateTime usedAt;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
}
