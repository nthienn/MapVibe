package com.mapvibe.MapVibe.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MapVinaSearchResponse(
        String status,
        List<Result> results,
        @JsonProperty("error_message")
        String errorMessage
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Result(Geometry geometry) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Geometry(Location location) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Location(Double lat, Double lng) {
    }
}
