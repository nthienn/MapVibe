package com.mapvibe.MapVibe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PricingItemRequest {
    Long id;
    String clientId;

    @NotBlank(message = "PRICING_ITEM_TITLE_REQUIRED")
    String title;

    String description;

    @NotNull(message = "PRICING_ITEM_PRICE_REQUIRED")
    BigDecimal price;
}
