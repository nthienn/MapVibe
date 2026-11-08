package com.mapvibe.MapVibe.mapper;

import com.mapvibe.MapVibe.dto.request.CategoryCreateRequest;
import com.mapvibe.MapVibe.dto.request.CategoryUpdateRequest;
import com.mapvibe.MapVibe.dto.response.CategoryResponse;
import com.mapvibe.MapVibe.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryCreateRequest request);

    CategoryResponse toCategoryResponse(Category category);

    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);
}
