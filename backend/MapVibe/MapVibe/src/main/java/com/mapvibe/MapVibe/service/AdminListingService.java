package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.response.LocationMinResponse;
import com.mapvibe.MapVibe.dto.response.LocationResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.LocationStatus;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.LocationMapper;
import com.mapvibe.MapVibe.repository.LocationRepository;
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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminListingService {

    LocationRepository locationRepository;
    LocationMapper locationMapper;
    PricingService pricingService;

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<LocationMinResponse> getListings(LocationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by(
                        Sort.Order.desc("createdAt"),
                        Sort.Order.desc("id")
                )
        );

        Page<Location> locationPage = locationRepository.findByStatus(status, pageable);

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

    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getListingStatusCounts() {
        Map<String, Long> counts = new LinkedHashMap<>();

        // Initialize every status to zero.
        for (LocationStatus status : LocationStatus.values()) {
            counts.put(status.name(), 0L);
        }

        // Replace zero with the actual count from the database.
        for (Object[] row : locationRepository.countListingsByStatus()) {
            LocationStatus status = (LocationStatus) row[0];
            Number count = (Number) row[1];

            counts.put(status.name(), count.longValue());
        }

        return counts;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public LocationResponse getListing(Long id) {
        Location location = findListing(id);

        LocationResponse response = locationMapper.toLocationResponse(location);

        pricingService.enrichPricingResponse(location, response);

        return response;
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public LocationResponse approveListing(Long id) {
        Location location = findListing(id);

        validateStatus(location, LocationStatus.PENDING);

        location.setStatus(LocationStatus.ACTIVE);

        Location saved = locationRepository.save(location);

        return buildLocationResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public LocationResponse rejectListing(Long id) {
        Location location = findListing(id);

        validateStatus(location, LocationStatus.PENDING);

        location.setStatus(LocationStatus.REJECTED);

        Location saved = locationRepository.save(location);

        return buildLocationResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public LocationResponse deactivateListing(Long id) {
        Location location = findListing(id);

        validateStatus(location, LocationStatus.ACTIVE);

        location.setStatus(LocationStatus.INACTIVE);

        Location saved = locationRepository.save(location);

        return buildLocationResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public LocationResponse reactivateListing(Long id) {
        Location location = findListing(id);

        validateStatus(location, LocationStatus.INACTIVE);

        location.setStatus(LocationStatus.ACTIVE);

        Location saved = locationRepository.save(location);

        return buildLocationResponse(saved);
    }

    private Location findListing(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));
    }

    private void validateStatus(Location location, LocationStatus expectedStatus) {
        if (location.getStatus() != expectedStatus) {
            throw new AppException(ErrorCode.ADMIN_LISTING_STATUS_INVALID);
        }
    }

    private LocationResponse buildLocationResponse(Location location) {
        LocationResponse response = locationMapper.toLocationResponse(location);

        pricingService.enrichPricingResponse(location, response);

        return response;
    }
}
