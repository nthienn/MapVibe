package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.LocationCreateRequest;
import com.mapvibe.MapVibe.dto.request.LocationSearchRequest;
import com.mapvibe.MapVibe.dto.request.LocationUpdateRequest;
import com.mapvibe.MapVibe.dto.response.LocationMinResponse;
import com.mapvibe.MapVibe.dto.response.LocationResponse;
import com.mapvibe.MapVibe.dto.response.LocationSuggestionResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.entity.*;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.AdministrativeMapper;
import com.mapvibe.MapVibe.mapper.LocationMapper;
import com.mapvibe.MapVibe.repository.*;
import com.mapvibe.MapVibe.security.CurrentUserService;
import com.mapvibe.MapVibe.utils.SlugUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationService {

    LocationRepository locationRepository;
    CategoryRepository categoryRepository;
    UserRepository userRepository;
    AmenityRepository amenityRepository;
    BookmarkRepository bookmarkRepository;
    ReviewRepository reviewRepository;
    ProvinceRepository provinceRepository;
    WardRepository wardRepository;
    LocationMapper locationMapper;
    AdministrativeMapper administrativeMapper;
    MediaService mediaService;
    CurrentUserService currentUserService;
    PricingService pricingService;
    OpeningHourService openingHourService;
    BookmarkService bookmarkService;

    @PreAuthorize("hasAuthority('CREATE_LOCATION')")
    public LocationResponse createLocation(LocationCreateRequest request) {
        validateCoordinates(request.getLatitude(), request.getLongitude());

        User user = currentUserService.getUser();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Location location = locationMapper.toLocation(request);
        location.setUser(user);
        location.setCategory(category);
        location.setSlug(generateUniqueSlug(request.getName()));
        location.setStatus(LocationStatus.PENDING);

        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findAllById(request.getAmenityIds());
            location.setAmenities(amenities);
        }

        setLocationAdministrativeArea(location, request.getProvinceCode(), request.getWardCode());

        syncBidirectionalRelationships(location);

        pricingService.createPricing(location, request);

        Location saved = locationRepository.save(location);

        return buildLocationResponse(saved);
    }

    public PageResponse<LocationMinResponse> getLocations(LocationSearchRequest request) {
        validateDistanceFilter(request);

        List<Long> amenityIds = request.getAmenityIds() == null
                ? List.of()
                : request.getAmenityIds().stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        int amenityCount = amenityIds.size();

        List<Long> queryAmenityIds = amenityCount == 0
                ? List.of(-1L)
                : amenityIds;

        String sort = normalizeSort(request.getSort());

        Sort locationSort = buildLocationSort(sort);

        Pageable pageable = PageRequest.of(
                request.getPage() - 1,
                request.getSize(),
                locationSort
        );

        Pageable distancePageable = PageRequest.of(
                request.getPage() - 1,
                request.getSize()
        );

        Long categoryId = null;

        if (StringUtils.hasText(request.getCategory())) {
            Category category = categoryRepository.findBySlug(request.getCategory())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

            categoryId = category.getId();
        }

        String keyword = StringUtils.hasText(request.getKeyword())
                ? request.getKeyword().trim()
                : null;

        Page<Location> locationPage;

        if (request.getLocationId() != null) {
            Location selectedLocation = locationRepository
                    .findById(request.getLocationId())
                    .filter(location -> location.getStatus() == LocationStatus.ACTIVE)
                    .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

            if (request.getRadius() != null) {
                locationPage = locationRepository.searchLocationsByDistance(
                        categoryId,
                        keyword,
                        queryAmenityIds,
                        amenityCount,
                        selectedLocation.getLatitude(),
                        selectedLocation.getLongitude(),
                        request.getRadius(),
                        sort,
                        distancePageable
                );
            } else {
                locationPage = locationRepository.searchLocationById(
                        request.getLocationId(),
                        categoryId,
                        queryAmenityIds,
                        amenityCount,
                        pageable
                );
            }
        } else {
            locationPage = locationRepository.searchLocations(
                    categoryId,
                    keyword,
                    queryAmenityIds,
                    amenityCount,
                    pageable
            );
        }

        List<LocationMinResponse> data = locationPage.getContent()
                .stream()
                .map(locationMapper::toLocationMinResponse)
                .toList();

        bookmarkService.enrichBookmarkStatus(data);

        return PageResponse.<LocationMinResponse>builder()
                .currentPage(request.getPage())
                .totalPages(locationPage.getTotalPages())
                .totalElements(locationPage.getTotalElements())
                .pageSize(locationPage.getSize())
                .data(data)
                .build();
    }

    public List<LocationSuggestionResponse> getLocationSuggestions(String keyword, int size) {
        if (!StringUtils.hasText(keyword)) {
            return List.of();
        }

        String trimmedKeyword = keyword.trim();

        Pageable pageable = PageRequest.of(0, size);

        return locationRepository
                .searchLocationSuggestions(trimmedKeyword, pageable)
                .stream()
                .map(this::toLocationSuggestionResponse)
                .toList();
    }

    public LocationResponse getLocation(String slug) {
        Location location = locationRepository
                .findBySlugAndStatus(slug, LocationStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        LocationResponse response = buildLocationResponse(location);

        long totalBookmarks = bookmarkRepository.countByLocationId(location.getId());
        response.setBookmarkCount(totalBookmarks);

        String userEmail = currentUserService.getEmail();

        if (userEmail != null && !userEmail.equals("anonymousUser")) {
            userRepository.findByEmail(userEmail).ifPresent(user -> {
                boolean isBookmarked = bookmarkRepository.existsByUserIdAndLocationId(user.getId(), location.getId());
                response.setBookmarked(isBookmarked);
            });
        } else {
            response.setBookmarked(false);
        }

        return response;
    }

    @PreAuthorize("@locationSecurity.isOwner(#id) or hasRole('ADMIN')")
    public LocationResponse getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        LocationResponse response = buildLocationResponse(location);

        return response;
    }

    @PreAuthorize("hasRole('USER')")
    public PageResponse<LocationMinResponse> getMyListings(int page, int size, LocationStatus status) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by(
                        Sort.Order.desc("createdAt"),
                        Sort.Order.desc("id")
                )
        );

        String userId = currentUserService.getUserId();

        Page<Location> locationPage = status == null
                ? locationRepository.findByUserId(userId, pageable)
                : locationRepository.findByUserIdAndStatus(userId, status, pageable);

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

    @Transactional
    @PreAuthorize(
            "(hasRole('ADMIN') and @locationSecurity.isActive(#id)) or " +
                    "(hasRole('USER') and @locationSecurity.isOwnerAndEditable(#id))"
    )
    public LocationResponse updateLocation(Long id, LocationUpdateRequest request) {
        validateCoordinates(request.getLatitude(), request.getLongitude());

        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        LocationStatus previousStatus = location.getStatus();

        if (request.getCategoryId() != null &&
                (location.getCategory() == null || !request.getCategoryId().equals(location.getCategory().getId()))) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

            location.setCategory(category);
        }

        if (request.getName() != null && !request.getName().equals(location.getName())) {
            location.setSlug(generateUniqueSlug(request.getName()));
        }

        if (request.getImages() != null) {
            List<String> oldImages = new ArrayList<>(location.getImages());
            List<String> newImages = request.getImages();

            List<String> imagesToDelete = oldImages.stream()
                    .filter(img -> !newImages.contains(img))
                    .toList();

            imagesToDelete.forEach(mediaService::deleteImageFromCloudinary);

            location.setImages(newImages);
        }

        if (request.getAmenityIds() != null) {
            List<Amenity> amenities = amenityRepository.findAllById(request.getAmenityIds());
            location.setAmenities(amenities);
        }

        locationMapper.updateLocation(location, request);

        location.setStatus(
                previousStatus == LocationStatus.REJECTED
                        ? LocationStatus.PENDING
                        : previousStatus
        );

        setLocationAdministrativeArea(location, request.getProvinceCode(), request.getWardCode());

        openingHourService.updateOpeningHours(location, request.getOpeningHours());
        pricingService.updatePricing(location, request);

        syncBidirectionalRelationships(location);

        Location saved = locationRepository.save(location);

        return buildLocationResponse(saved);
    }

    @Transactional
    @PreAuthorize("@locationSecurity.isOwner(#id) or hasRole('ADMIN')")
    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        bookmarkRepository.deleteByLocationId(id);

        List<Review> reviews = reviewRepository.findByLocationId(id);

        for (Review review : reviews) {
            if (review.getImages() != null && !review.getImages().isEmpty()) {
                review.getImages().forEach(mediaService::deleteImageFromCloudinary);
            }
        }

        reviewRepository.deleteAll(reviews);

        if (location.getAmenities() != null) {
            location.getAmenities().clear();
        }

        if (location.getImages() != null && !location.getImages().isEmpty()) {
            location.getImages().forEach(mediaService::deleteImageFromCloudinary);
        }

        locationRepository.delete(location);
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = SlugUtils.makeSlug(name);
        String finalSlug = baseSlug;
        int count = 1;

        while (locationRepository.existsBySlug(finalSlug)) {
            finalSlug = baseSlug + "-" + count;
            count++;
        }

        return finalSlug;
    }

    private void syncBidirectionalRelationships(Location location) {
        if (location.getOpeningHours() != null) {
            location.getOpeningHours().forEach(oh -> oh.setLocation(location));
        }

        if (location.getPricingItems() != null) {
            location.getPricingItems().forEach(pi -> pi.setLocation(location));
        }

        if (location.getPricingCategories() != null) {
            location.getPricingCategories().forEach(pc -> {
                pc.setLocation(location);

                if (pc.getItems() != null) {
                    pc.getItems().forEach(item -> {
                        item.setLocation(location);
                        item.setPricingCategory(pc);
                    });
                }
            });
        }
    }

    private LocationResponse buildLocationResponse(Location location) {
        LocationResponse response = locationMapper.toLocationResponse(location);

        pricingService.enrichPricingResponse(location, response);

        return response;
    }

    private void setLocationAdministrativeArea(Location location, String provinceCode, String wardCode) {
        Province province = provinceRepository.findById(provinceCode)
                .orElseThrow(() -> new AppException(ErrorCode.PROVINCE_NOT_FOUND));

        Ward ward = wardRepository.findById(wardCode)
                .orElseThrow(() -> new AppException(ErrorCode.WARD_NOT_FOUND));

        if (!ward.getProvince().getCode().equals(province.getCode())) {
            throw new AppException(ErrorCode.LOCATION_WARD_INVALID);
        }

        location.setProvince(province);
        location.setWard(ward);
    }

    private void validateCoordinates(Double latitude, Double longitude) {
        if (latitude == null && longitude == null) {
            throw new AppException(ErrorCode.LOCATION_COORDINATES_REQUIRED);
        }

        if (latitude == null || longitude == null) {
            throw new AppException(ErrorCode.LOCATION_COORDINATES_INVALID);
        }
    }

    private void validateDistanceFilter(LocationSearchRequest request) {
        boolean hasLocationId = request.getLocationId() != null;
        boolean hasRadius = request.getRadius() != null;

        // No location/radius filter
        if (!hasLocationId && !hasRadius) {
            return;
        }

        // Radius requires a selected location
        if (!hasLocationId && hasRadius) {
            throw new AppException(
                    ErrorCode.LOCATION_SEARCH_COORDINATES_INVALID
            );
        }

        // Radius must be positive
        if (hasRadius && request.getRadius() <= 0) {
            throw new AppException(
                    ErrorCode.LOCATION_SEARCH_RADIUS_INVALID
            );
        }
    }

    private LocationSuggestionResponse toLocationSuggestionResponse(Location location) {
        return LocationSuggestionResponse.builder()
                .id(location.getId())
                .name(location.getName())
                .slug(location.getSlug())
                .address(location.getAddress())
                .province(administrativeMapper.toProvinceResponse(location.getProvince()))
                .ward(administrativeMapper.toWardResponse(location.getWard()))
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .build();
    }

    private String normalizeSort(String sort) {
        if (!StringUtils.hasText(sort)) {
            return "default";
        }

        String normalized = sort.trim().toLowerCase();

        return switch (normalized) {
            case "default",
                 "highest_rated",
                 "most_reviewed",
                 "newest",
                 "oldest" -> normalized;

            default -> "default";
        };
    }

    private Sort buildLocationSort(String sort) {
        return switch (sort) {
            case "highest_rated" -> Sort.by(
                    Sort.Order.desc("averageRating"),
                    Sort.Order.desc("totalReviews"),
                    Sort.Order.desc("createdAt"),
                    Sort.Order.desc("id")
            );

            case "most_reviewed" -> Sort.by(
                    Sort.Order.desc("totalReviews"),
                    Sort.Order.desc("averageRating"),
                    Sort.Order.desc("createdAt"),
                    Sort.Order.desc("id")
            );

            case "oldest" -> Sort.by(
                    Sort.Order.asc("createdAt"),
                    Sort.Order.asc("id")
            );

            case "newest",
                 "default" -> Sort.by(
                    Sort.Order.desc("createdAt"),
                    Sort.Order.desc("id")
            );

            default -> Sort.by(
                    Sort.Order.desc("createdAt"),
                    Sort.Order.desc("id")
            );
        };
    }
}
