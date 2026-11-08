package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.request.AmenityCreateRequest;
import com.mapvibe.MapVibe.dto.request.AmenityUpdateRequest;
import com.mapvibe.MapVibe.dto.response.AmenityResponse;
import com.mapvibe.MapVibe.entity.Amenity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AmenityMapper {
    Amenity toAmenity(AmenityCreateRequest request);

    AmenityResponse toAmenityResponse(Amenity amenity);

    void updateAmenity(@MappingTarget Amenity amenity, AmenityUpdateRequest request);
}
