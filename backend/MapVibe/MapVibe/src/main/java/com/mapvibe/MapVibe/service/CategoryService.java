package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.CategoryCreateRequest;
import com.mapvibe.MapVibe.dto.request.CategoryUpdateRequest;
import com.mapvibe.MapVibe.dto.response.CategoryResponse;
import com.mapvibe.MapVibe.dto.response.PageResponse;
import com.mapvibe.MapVibe.entity.Category;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.CategoryMapper;
import com.mapvibe.MapVibe.repository.CategoryRepository;
import com.mapvibe.MapVibe.repository.LocationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {

    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    LocationRepository locationRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        String name = request.getName().trim();
        String slug = generateSlug(name);

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        if (categoryRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        Category category = categoryMapper.toCategory(request);
        category.setName(name);
        category.setSlug(slug);
        category.setIcon(request.getIcon().trim());

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<CategoryResponse> getAdminCategories(int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by(Sort.Direction.ASC, "name")
        );

        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryResponse> data = categoryPage.getContent()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();

        return PageResponse.<CategoryResponse>builder()
                .currentPage(page)
                .totalPages(categoryPage.getTotalPages())
                .totalElements(categoryPage.getTotalElements())
                .pageSize(categoryPage.getSize())
                .data(data)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        String name = request.getName().trim();
        String slug = generateSlug(name);

        // Chỉ kiểm tra trùng tên với category khác.
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        // Tránh trùng slug với category khác.
        if (!slug.equals(category.getSlug())
                && categoryRepository.existsBySlugAndIdNot(slug, id)
        ) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        categoryMapper.updateCategory(category, request);

        category.setName(name);
        category.setSlug(slug);
        category.setIcon(request.getIcon().trim());

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (locationRepository.existsByCategory_Id(id)) {
            throw new AppException(ErrorCode.CATEGORY_IN_USE);
        }

        categoryRepository.delete(category);
    }

    private String generateSlug(String value) {
        String normalized = value.trim()
                .replace('đ', 'd')
                .replace('Đ', 'D');

        normalized = Normalizer.normalize(
                        normalized,
                        Normalizer.Form.NFD
                ).replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT);

        return normalized
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}
