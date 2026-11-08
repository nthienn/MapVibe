package com.mapvibe.MapVibe.controller;

import com.mapvibe.MapVibe.dto.response.ApiResponse;
import com.mapvibe.MapVibe.dto.response.ProvinceResponse;
import com.mapvibe.MapVibe.dto.response.WardResponse;
import com.mapvibe.MapVibe.service.AdministrativeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/provinces")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdministrativeController {

    AdministrativeService administrativeService;

    @GetMapping
    public ApiResponse<List<ProvinceResponse>> getProvinces() {
        return ApiResponse.<List<ProvinceResponse>>builder()
                .result(administrativeService.getProvinces())
                .build();
    }

    @GetMapping("/{provinceCode}/wards")
    public ApiResponse<List<WardResponse>> getWards(@PathVariable String provinceCode) {
        return ApiResponse.<List<WardResponse>>builder()
                .result(administrativeService.getWardsByProvince(provinceCode))
                .build();
    }
}
