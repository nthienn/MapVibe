package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.request.MapVinaSearchRequest;
import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.MapVinaCoordinatesResponse;
import com.mapvibe.MapVibe.service.MapVinaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mapvina")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MapVinaController {

    MapVinaService mapVinaService;

    @PostMapping("/search")
    public ApiResponse<MapVinaCoordinatesResponse> search(@RequestBody MapVinaSearchRequest request) {
        return ApiResponse.<MapVinaCoordinatesResponse>builder()
                .result(mapVinaService.search(request))
                .build();
    }
}
