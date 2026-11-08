package com.mapvibe.MapVibe.security;

import com.mapvibe.MapVibe.entity.LocationStatus;
import com.mapvibe.MapVibe.repository.LocationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component("locationSecurity")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationSecurity {
    LocationRepository locationRepository;
    CurrentUserService currentUserService;

    public boolean isOwner(Long locationId) {
        return locationRepository.findById(locationId)
                .map(location -> location.getUser().getEmail().equals(currentUserService.getEmail()))
                .orElse(false);
    }

    public boolean isActive(Long locationId) {
        return locationRepository.findById(locationId)
                .map(location -> location.getStatus() == LocationStatus.ACTIVE)
                .orElse(false);
    }

    public boolean isOwnerAndEditable(Long locationId) {
        return locationRepository.findById(locationId)
                .map(location -> {
                    boolean isOwner = Objects.equals(
                            location.getUser().getEmail(),
                            currentUserService.getEmail()
                    );

                    LocationStatus status = location.getStatus();

                    boolean isEditableStatus =
                            status == LocationStatus.ACTIVE
                                    || status == LocationStatus.PENDING
                                    || status == LocationStatus.REJECTED;

                    return isOwner && isEditableStatus;
                })
                .orElse(false);
    }
}
