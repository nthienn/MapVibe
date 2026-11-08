package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.response.ProvinceResponse;
import com.mapvibe.MapVibe.dto.response.WardResponse;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.AdministrativeMapper;
import com.mapvibe.MapVibe.repository.ProvinceRepository;
import com.mapvibe.MapVibe.repository.WardRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdministrativeService {

    ProvinceRepository provinceRepository;
    WardRepository wardRepository;
    AdministrativeMapper administrativeMapper;

    public List<ProvinceResponse> getProvinces() {
        return provinceRepository
                .findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(administrativeMapper::toProvinceResponse)
                .toList();
    }

    public List<WardResponse> getWardsByProvince(String provinceCode) {
        if (!provinceRepository.existsById(provinceCode)) {
            throw new AppException(ErrorCode.PROVINCE_NOT_FOUND);
        }

        return wardRepository
                .findByProvinceCodeOrderByNameAsc(provinceCode)
                .stream()
                .map(administrativeMapper::toWardResponse)
                .toList();
    }
}
