package com.mapvibe.MapVibe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OpeningHourResponse {
    Long id;
    Integer dayOfWeek;
    LocalTime openTime;
    LocalTime closeTime;
    Boolean isClosed;
}
