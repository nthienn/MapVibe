package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.dto.response.PopularCategoryResponse;
import com.mapvibe.MapVibe.entity.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    Optional<Category> findBySlug(String slug);

    @Query("""
            SELECT new com.mapvibe.MapVibe.dto.response.PopularCategoryResponse(c.id, c.name, c.slug, c.icon, COUNT(l.id))
            FROM Location l
            RIGHT JOIN l.category c
            WHERE l.status = com.mapvibe.MapVibe.entity.LocationStatus.ACTIVE
            GROUP BY c.id, c.name, c.slug, c.icon
            ORDER BY COUNT(l.id) DESC
            """)
    List<PopularCategoryResponse> findPopularCategories(Pageable pageable);
}
