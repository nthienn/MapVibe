package com.mapvibe.MapVibe.dto.request;

public record MapVinaSearchRequest(
        String address,
        String ward,
        String province
) {
}
