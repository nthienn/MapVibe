package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.AmenityCreateRequest;
import com.mapvibe.MapVibe.dto.request.AmenityUpdateRequest;
import com.mapvibe.MapVibe.dto.response.AmenityResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.entity.Amenity;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.AmenityMapper;
import com.mapvibe.MapVibe.repository.AmenityRepository;
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

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AmenityService {

    AmenityRepository amenityRepository;
    AmenityMapper amenityMapper;
    LocationRepository locationRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public AmenityResponse createAmenity(AmenityCreateRequest request) {
        String name = request.getName().trim();

        if (amenityRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.AMENITY_ALREADY_EXISTS);
        }

        Amenity amenity = amenityMapper.toAmenity(request);
        amenity.setName(name);

        return amenityMapper.toAmenityResponse(amenityRepository.save(amenity));
    }

    public List<AmenityResponse> getAmenities() {
        return amenityRepository.findAll().stream()
                .map(amenityMapper::toAmenityResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<AmenityResponse> getAdminAmenities(int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by(Sort.Direction.ASC, "name")
        );

        Page<Amenity> amenityPage = amenityRepository.findAll(pageable);

        List<AmenityResponse> data = amenityPage.getContent()
                .stream()
                .map(amenityMapper::toAmenityResponse)
                .toList();

        return PageResponse.<AmenityResponse>builder()
                .currentPage(page)
                .totalPages(amenityPage.getTotalPages())
                .totalElements(amenityPage.getTotalElements())
                .pageSize(amenityPage.getSize())
                .data(data)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public AmenityResponse updateAmenity(Long id, AmenityUpdateRequest request) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_FOUND));

        String name = request.getName().trim();

        if (amenityRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new AppException(ErrorCode.AMENITY_ALREADY_EXISTS);
        }

        amenityMapper.updateAmenity(amenity, request);
        amenity.setName(name);

        return amenityMapper.toAmenityResponse(amenityRepository.save(amenity));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAmenity(Long id) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_FOUND));

        if (locationRepository.existsByAmenities_Id(id)) {
            throw new AppException(ErrorCode.AMENITY_IN_USE);
        }

        amenityRepository.delete(amenity);
    }
}
