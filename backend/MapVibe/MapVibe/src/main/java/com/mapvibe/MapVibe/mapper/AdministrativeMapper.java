package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.response.ProvinceResponse;
import com.mapvibe.MapVibe.dto.response.WardResponse;
import com.mapvibe.MapVibe.entity.Province;
import com.mapvibe.MapVibe.entity.Ward;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdministrativeMapper {

    ProvinceResponse toProvinceResponse(Province province);

    WardResponse toWardResponse(Ward ward);
}
