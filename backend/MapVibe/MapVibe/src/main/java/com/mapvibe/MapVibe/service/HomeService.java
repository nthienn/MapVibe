package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.response.LocationMinResponse;
import com.mapvibe.MapVibe.dto.response.PopularCategoryResponse;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.mapper.LocationMapper;
import com.mapvibe.MapVibe.repository.CategoryRepository;
import com.mapvibe.MapVibe.repository.LocationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeService {

    CategoryRepository categoryRepository;
    LocationRepository locationRepository;
    LocationMapper locationMapper;
    BookmarkService bookmarkService;

    public List<PopularCategoryResponse> getPopularCategories(int limit) {
        return categoryRepository.findPopularCategories(PageRequest.of(0, limit));
    }

    public List<LocationMinResponse> getPopularLocations(int limit) {
        List<Location> locations = locationRepository.findPopularLocations(PageRequest.of(0, limit));

        List<LocationMinResponse> responses = locations.stream()
                .map(locationMapper::toLocationMinResponse)
                .toList();

        bookmarkService.enrichBookmarkStatus(responses);

        return responses;
    }
}
