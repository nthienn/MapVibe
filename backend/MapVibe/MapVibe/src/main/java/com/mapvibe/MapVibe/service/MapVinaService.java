package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.config.MapVinaProperties;
import com.mapvibe.MapVibe.dto.request.MapVinaSearchRequest;
import com.mapvibe.MapVibe.dto.response.MapVinaCoordinatesResponse;
import com.mapvibe.MapVibe.dto.response.MapVinaSearchResponse;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MapVinaService {

    RestClient mapVinaRestClient;
    MapVinaProperties mapVinaProperties;

    public MapVinaCoordinatesResponse search(MapVinaSearchRequest request) {

        String query = Stream.of(
                        request.address(),
                        request.ward(),
                        request.province()
                )
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .collect(Collectors.joining(", "));

        var uri = UriComponentsBuilder
                .fromUriString(mapVinaProperties.getSearchUrl())
                .queryParam("language", "vi")
                .queryParam("key", mapVinaProperties.getApiKey())
                .queryParam("query", query)
                .queryParam("new_admin", true)
                .build()
                .encode()
                .toUri();

        MapVinaSearchResponse response;

        try {
            response = mapVinaRestClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(MapVinaSearchResponse.class);
        } catch (RestClientException e) {
            throw new AppException(ErrorCode.MAPVINA_SEARCH_FAILED);
        }

        if (response == null) {
            throw new AppException(ErrorCode.MAPVINA_SEARCH_FAILED);
        }

        if ("ZERO_RESULTS".equals(response.status())) {
            throw new AppException(ErrorCode.MAPVINA_LOCATION_NOT_FOUND);
        }

        if (!"OK".equals(response.status())) {
            throw new AppException(ErrorCode.MAPVINA_SEARCH_FAILED);
        }

        if (response.results() == null
                || response.results().isEmpty()
                || response.results().getFirst().geometry() == null
                || response.results().getFirst().geometry().location() == null
        ) {
            throw new AppException(ErrorCode.MAPVINA_SEARCH_FAILED);
        }

        MapVinaSearchResponse.Location location = response.results()
                .getFirst()
                .geometry()
                .location();

        return new MapVinaCoordinatesResponse(
                location.lat(),
                location.lng()
        );
    }
}
