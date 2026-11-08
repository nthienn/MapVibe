package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.ReviewCreateRequest;
import com.mapvibe.MapVibe.dto.request.ReviewUpdateRequest;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.dto.response.ReviewResponse;
import com.mapvibe.MapVibe.dto.response.UserReviewResponse;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.Review;
import com.mapvibe.MapVibe.entity.User;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.ReviewMapper;
import com.mapvibe.MapVibe.repository.LocationRepository;
import com.mapvibe.MapVibe.repository.ReviewRepository;
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

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {

    ReviewRepository reviewRepository;
    LocationRepository locationRepository;
    ReviewMapper reviewMapper;
    MediaService mediaService;
    CurrentUserService currentUserService;

    @PreAuthorize("hasRole('USER')")
    public ReviewResponse createReview(Long locationId, ReviewCreateRequest request) {
        User user = currentUserService.getUser();

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        if (reviewRepository.existsByUserIdAndLocationId(user.getId(), locationId)) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        Review review = reviewMapper.toReview(request);
        review.setUser(user);
        review.setLocation(location);

        Review savedReview = reviewRepository.save(review);
        updateLocationRatingStats(locationId);

        return reviewMapper.toReviewResponse(savedReview);
    }

    public PageResponse<ReviewResponse> getReviews(Long locationId, int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("createdAt").descending()
        );

        if (!locationRepository.existsById(locationId)) {
            throw new AppException(ErrorCode.LOCATION_NOT_FOUND);
        }

        Page<Review> reviewPage = reviewRepository.findByLocationId(locationId, pageable);

        List<ReviewResponse> data = reviewPage.getContent().stream()
                .map(reviewMapper::toReviewResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .currentPage(page)
                .totalPages(reviewPage.getTotalPages())
                .totalElements(reviewPage.getTotalElements())
                .pageSize(reviewPage.getSize())
                .data(data)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserReviewResponse> getAdminReviews(int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Review> reviewPage = reviewRepository.findAll(pageable);

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

    @PreAuthorize("hasRole('USER')")
    public PageResponse<UserReviewResponse> getMyReviews(int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Review> reviewPage = reviewRepository.findByUserId(currentUserService.getUserId(), pageable);

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

    @PreAuthorize("@reviewSecurity.isOwner(#reviewId)")
    public ReviewResponse updateReview(Long locationId, String reviewId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getLocation().getId().equals(locationId)) {
            throw new AppException(ErrorCode.INVALID_LOCATION_REVIEW);
        }

        if (request.getImages() != null) {
            List<String> oldImages = review.getImages() != null
                    ? new ArrayList<>(review.getImages())
                    : new ArrayList<>();

            List<String> newImages = request.getImages();

            List<String> imagesToDelete = oldImages.stream()
                    .filter(img -> !newImages.contains(img))
                    .toList();

            imagesToDelete.forEach(mediaService::deleteImageFromCloudinary);

            review.setImages(newImages);
        }

        reviewMapper.updateReview(review, request);
        Review savedReview = reviewRepository.save(review);
        updateLocationRatingStats(locationId);

        return reviewMapper.toReviewResponse(savedReview);
    }

    @PreAuthorize("@reviewSecurity.isOwner(#reviewId) or hasRole('ADMIN')")
    public void deleteReview(Long locationId, String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getLocation().getId().equals(locationId)) {
            throw new AppException(ErrorCode.INVALID_LOCATION_REVIEW);
        }

        if (review.getImages() != null && !review.getImages().isEmpty()) {
            review.getImages().forEach(mediaService::deleteImageFromCloudinary);
        }

        reviewRepository.delete(review);
        updateLocationRatingStats(locationId);
    }

    private void updateLocationRatingStats(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        long totalReviews = reviewRepository.countByLocationId(locationId);
        Double averageRating = reviewRepository.getAverageRatingByLocationId(locationId);

        location.setTotalReviews((int) totalReviews);
        location.setAverageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);

        locationRepository.save(location);
    }
}
