package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.request.LocationCreateRequest;
import com.mapvibe.MapVibe.dto.request.LocationUpdateRequest;
import com.mapvibe.MapVibe.dto.response.*;
import com.mapvibe.MapVibe.entity.Category;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.PricingCategory;
import com.mapvibe.MapVibe.entity.PricingItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = AdministrativeMapper.class)
public interface LocationMapper {

    @Mapping(target = "province", ignore = true)
    @Mapping(target = "ward", ignore = true)
    Location toLocation(LocationCreateRequest request);

    @Mapping(target = "category", source = "category")
    @Mapping(target = "pricingItems", ignore = true)
    @Mapping(target = "pricingOrder", ignore = true)
    LocationResponse toLocationResponse(Location location);

    CategoryResponse toCategoryResponse(Category category);

    @Mapping(target = "category", source = "category")
    LocationMinResponse toLocationMinResponse(Location location);

    PricingItemResponse toPricingItemResponse(PricingItem pricingItem);

    @Mapping(target = "items", ignore = true)
    PricingCategoryResponse toPricingCategoryResponse(PricingCategory category);

    @Mapping(target = "images", ignore = true)
    @Mapping(target = "openingHours", ignore = true)
    @Mapping(target = "pricingCategories", ignore = true)
    @Mapping(target = "pricingItems", ignore = true)
    @Mapping(target = "province", ignore = true)
    @Mapping(target = "ward", ignore = true)
    void updateLocation(@MappingTarget Location location, LocationUpdateRequest request);
}
