package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.request.ReviewCreateRequest;
import com.mapvibe.MapVibe.dto.request.ReviewUpdateRequest;
import com.mapvibe.MapVibe.dto.response.ReviewResponse;
import com.mapvibe.MapVibe.dto.response.UserReviewResponse;
import com.mapvibe.MapVibe.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    Review toReview(ReviewCreateRequest request);

    ReviewResponse toReviewResponse(Review review);

    UserReviewResponse toUserReviewResponse(Review review);

    @Mapping(target = "images", ignore = true)
    void updateReview(@MappingTarget Review review, ReviewUpdateRequest request);
}
