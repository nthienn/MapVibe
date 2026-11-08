package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.OpeningHourRequest;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.OpeningHour;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpeningHourService {

    public void updateOpeningHours(Location location, List<OpeningHourRequest> requests) {
        validateOpeningHours(requests);

        if (location.getOpeningHours() == null) {
            location.setOpeningHours(new ArrayList<>());
        }

        List<OpeningHour> openingHours = location.getOpeningHours();

        /*
         * Remove old hours.
         */
        openingHours.clear();

        if (requests == null || requests.isEmpty()) {
            return;
        }

        /*
         * Create new hours from request.
         */
        for (OpeningHourRequest request : requests) {
            OpeningHour openingHour = new OpeningHour();

            openingHour.setLocation(location);
            openingHour.setDayOfWeek(request.getDayOfWeek());
            openingHour.setIsClosed(Boolean.TRUE.equals(request.getIsClosed()));

            /*
             * Closed day doesn't need open/close time.
             */
            if (Boolean.TRUE.equals(request.getIsClosed())) {
                openingHour.setOpenTime(null);
                openingHour.setCloseTime(null);
            } else {
                openingHour.setOpenTime(request.getOpenTime());
                openingHour.setCloseTime(request.getCloseTime());
            }

            openingHours.add(openingHour);
        }
    }

    private void validateOpeningHours(List<OpeningHourRequest> openingHours) {
        if (openingHours == null) {
            return;
        }

        for (OpeningHourRequest request : openingHours) {
            if (Boolean.TRUE.equals(request.getIsClosed())) {
                continue;
            }

            if (request.getOpenTime() == null || request.getCloseTime() == null) {
                throw new AppException(ErrorCode.OPENING_HOUR_TIME_REQUIRED);
            }

            if (!request.getOpenTime().isBefore(request.getCloseTime())) {
                throw new AppException(ErrorCode.OPENING_HOUR_INVALID);
            }
        }
    }
}
