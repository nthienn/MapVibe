package com.mapvibe.MapVibe.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PricingCategoryRequest {
    Long id;
    String clientId;

    @NotBlank(message = "PRICING_CATEGORY_TITLE_REQUIRED")
    String categoryTitle;

    List<PricingItemRequest> items;
}
