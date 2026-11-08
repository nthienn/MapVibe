package com.mapvibe.MapVibe.security;

import com.mapvibe.MapVibe.repository.ReviewRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component("reviewSecurity")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewSecurity {
    ReviewRepository reviewRepository;
    CurrentUserService currentUserService;

    public boolean isOwner(String reviewId) {
        return reviewRepository.findById(reviewId)
                .map(review -> review.getUser().getEmail().equals(currentUserService.getEmail()))
                .orElse(false);
    }
}
