package com.mapvibe.MapVibe.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OpeningHourRequest {
    Integer dayOfWeek;
    LocalTime openTime;
    LocalTime closeTime;
    Boolean isClosed;
}
