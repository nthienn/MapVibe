package com.mapvibe.MapVibe.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationCreateRequest {

    @NotBlank(message = "LOCATION_NAME_REQUIRED")
    String name;

    @NotNull(message = "LOCATION_CATEGORY_REQUIRED")
    Long categoryId;

    @NotBlank(message = "LOCATION_PROVINCE_REQUIRED")
    String provinceCode;

    @NotBlank(message = "LOCATION_WARD_REQUIRED")
    String wardCode;

    @NotBlank(message = "LOCATION_ADDRESS_REQUIRED")
    String address;

    @DecimalMin(
            value = "-90.0",
            message = "LOCATION_LATITUDE_INVALID"
    )
    @DecimalMax(
            value = "90.0",
            message = "LOCATION_LATITUDE_INVALID"
    )
    Double latitude;

    @DecimalMin(
            value = "-180.0",
            message = "LOCATION_LONGITUDE_INVALID"
    )
    @DecimalMax(
            value = "180.0",
            message = "LOCATION_LONGITUDE_INVALID"
    )
    Double longitude;

    List<String> images;
    String description;
    String phone;
    String email;
    String website;
    String facebook;
    String instagram;
    String tiktok;
    List<Long> amenityIds;

    @Valid
    List<OpeningHourRequest> openingHours;

    @Valid
    List<PricingCategoryRequest> pricingCategories;

    @Valid
    List<PricingItemRequest> pricingItems;

    @Valid
    List<PricingOrderRequest> pricingOrder;
}
