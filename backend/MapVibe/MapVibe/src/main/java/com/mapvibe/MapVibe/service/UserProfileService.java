package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.response.*;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.Review;
import com.mapvibe.MapVibe.entity.User;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.LocationMapper;
import com.mapvibe.MapVibe.mapper.ReviewMapper;
import com.mapvibe.MapVibe.mapper.UserMapper;
import com.mapvibe.MapVibe.repository.LocationRepository;
import com.mapvibe.MapVibe.repository.ReviewRepository;
import com.mapvibe.MapVibe.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {

    UserRepository userRepository;
    LocationRepository locationRepository;
    ReviewRepository reviewRepository;
    UserMapper userMapper;
    LocationMapper locationMapper;
    ReviewMapper reviewMapper;
    BookmarkService bookmarkService;

    public UserProfileResponse getUserProfile(
            String userId,
            int listingsPage,
            int listingsSize,
            int reviewsPage,
            int reviewsSize
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserMinResponse userResponse = userMapper.toUserMinResponse(user);

        PageResponse<LocationMinResponse> listings =
                getUserListings(
                        userId,
                        listingsPage,
                        listingsSize
                );

        bookmarkService.enrichBookmarkStatus(listings.getData());

        PageResponse<UserReviewResponse> reviews =
                getUserReviews(
                        userId,
                        reviewsPage,
                        reviewsSize
                );

        Double averageRating = locationRepository.getAverageRatingByUserId(userId);

        return UserProfileResponse.builder()
                .user(userResponse)
                .listings(listings)
                .reviews(reviews)
                .averageRating(
                        averageRating != null
                                ? Math.round(averageRating * 10.0) / 10.0
                                : 0.0
                )
                .build();
    }

    private PageResponse<LocationMinResponse> getUserListings(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("createdAt").descending()
        );

        Page<Location> locationPage = locationRepository.findByUserId(userId, pageable);

        List<LocationMinResponse> data = locationPage.getContent()
                .stream()
                .map(locationMapper::toLocationMinResponse)
                .toList();

        return PageResponse.<LocationMinResponse>builder()
                .currentPage(page)
                .totalPages(locationPage.getTotalPages())
                .totalElements(locationPage.getTotalElements())
                .pageSize(locationPage.getSize())
                .data(data)
                .build();
    }

    private PageResponse<UserReviewResponse> getUserReviews(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("createdAt").descending()
        );

        Page<Review> reviewPage = reviewRepository.findByUserId(userId, pageable);

        List<UserReviewResponse> data = reviewPage.getContent()
                .stream()
                .map(reviewMapper::toUserReviewResponse)
                .toList();

        return PageResponse.<UserReviewResponse>builder()
                .currentPage(page)
                .totalPages(reviewPage.getTotalPages())
                .totalElements(reviewPage.getTotalElements())
                .pageSize(reviewPage.getSize())
                .data(data)
                .build();
    }
}
