package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.LocationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsBySlug(String slug);

    boolean existsByCategory_Id(Long categoryId);

    boolean existsByAmenities_Id(Long amenityId);

    Optional<Location> findBySlugAndStatus(String slug, LocationStatus status);

    Page<Location> findByUserId(String userId, Pageable pageable);

    Page<Location> findByUserIdAndStatus(
            String userId,
            LocationStatus status,
            Pageable pageable
    );

    Page<Location> findByStatus(LocationStatus status, Pageable pageable);


    @Query("""
            SELECT l.status, COUNT(l)
            FROM Location l
            GROUP BY l.status
            """)
    List<Object[]> countListingsByStatus();

    @Query("""
            SELECT l
            FROM Location l
            LEFT JOIN Bookmark b
            ON b.location.id = l.id
            WHERE l.status = com.mapvibe.MapVibe.entity.LocationStatus.ACTIVE
            GROUP BY l.id
            ORDER BY
                l.averageRating DESC,
                l.totalReviews DESC,
                COUNT(b.id) DESC
            """)
    List<Location> findPopularLocations(Pageable pageable);

    @Query("""
            SELECT AVG(l.averageRating)
            FROM Location l
            WHERE l.user.id = :userId
                AND l.totalReviews > 0
            """)
    Double getAverageRatingByUserId(@Param("userId") String userId);

    @Query("""
            SELECT l
            FROM Location l
            WHERE l.status = com.mapvibe.MapVibe.entity.LocationStatus.ACTIVE
              AND (:categoryId IS NULL OR l.category.id = :categoryId)
              AND (
                   COALESCE(:keyword, '') = ''
                   OR LOWER(l.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(l.address) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  )
              AND (
                   :amenityCount = 0
                   OR l.id IN (
                        SELECT l2.id
                        FROM Location l2
                        JOIN l2.amenities a
                        WHERE a.id IN :amenityIds
                        GROUP BY l2.id
                        HAVING COUNT(DISTINCT a.id) = :amenityCount
                    )
                  )
            """)
    Page<Location> searchLocations(
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            @Param("amenityIds") List<Long> amenityIds,
            @Param("amenityCount") int amenityCount,
            Pageable pageable
    );

    @Query(
            value = """
                    SELECT l.*
                    FROM locations l
                    WHERE l.status = 'ACTIVE'
                    AND (:categoryId IS NULL OR l.category_id = :categoryId)
                    AND (
                         COALESCE(:keyword, '') = ''
                         OR LOWER(l.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                         OR LOWER(l.address) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        )
                    AND (
                            :amenityCount = 0
                            OR l.id IN (
                                SELECT la.location_id
                                FROM location_amenities la
                                WHERE la.amenity_id IN (:amenityIds)
                                GROUP BY la.location_id
                                HAVING COUNT(DISTINCT la.amenity_id) = :amenityCount
                            )
                        )
                    AND
                        (
                            6371.0 * ACOS(
                                GREATEST(
                                    -1.0,
                                    LEAST(
                                        1.0,
                                        COS(RADIANS(:latitude))
                                        * COS(RADIANS(l.latitude))
                                        * COS(RADIANS(l.longitude) - RADIANS(:longitude))
                                        + SIN(RADIANS(:latitude))
                                        * SIN(RADIANS(l.latitude))
                                    )
                                )
                            )
                        ) <= :radius
                    ORDER BY
                        CASE
                            WHEN :sort = 'highest_rated'
                            THEN l.average_rating
                        END DESC NULLS LAST,
                    
                        CASE
                            WHEN :sort = 'highest_rated'
                            THEN l.total_reviews
                        END DESC NULLS LAST,
                    
                        CASE
                            WHEN :sort = 'most_reviewed'
                            THEN l.total_reviews
                        END DESC NULLS LAST,
                    
                        CASE
                            WHEN :sort = 'most_reviewed'
                            THEN l.average_rating
                        END DESC NULLS LAST,
                    
                        CASE
                            WHEN :sort IN ('default', 'newest')
                            THEN l.created_at
                        END DESC NULLS LAST,
                    
                        CASE
                            WHEN :sort = 'oldest'
                            THEN l.created_at
                        END ASC NULLS LAST,
                    
                        l.id DESC
                    """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM locations l
                    WHERE l.status = 'ACTIVE'
                    AND (:categoryId IS NULL OR l.category_id = :categoryId)
                    AND
                        (
                            COALESCE(:keyword, '') = ''
                            OR LOWER(l.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(l.address) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        )
                    AND
                        (
                            :amenityCount = 0
                            OR l.id IN (
                                SELECT la.location_id
                                FROM location_amenities la
                                WHERE la.amenity_id IN (:amenityIds)
                                GROUP BY la.location_id
                                HAVING COUNT(DISTINCT la.amenity_id) = :amenityCount
                            )
                        )
                    AND
                        (
                            6371.0 * ACOS(
                                GREATEST(
                                    -1.0,
                                    LEAST(
                                        1.0,
                                        COS(RADIANS(:latitude))
                                        * COS(RADIANS(l.latitude))
                                        * COS(RADIANS(l.longitude) - RADIANS(:longitude))
                                        + SIN(RADIANS(:latitude))
                                        * SIN(RADIANS(l.latitude))
                                    )
                                )
                            )
                        ) <= :radius
                    """,
            nativeQuery = true
    )
    Page<Location> searchLocationsByDistance(
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            @Param("amenityIds") List<Long> amenityIds,
            @Param("amenityCount") int amenityCount,
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radius") Double radius,
            @Param("sort") String sort,
            Pageable pageable
    );

    @Query("""
            SELECT l
            FROM Location l
            WHERE l.status = com.mapvibe.MapVibe.entity.LocationStatus.ACTIVE
              AND (
                  LOWER(l.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(l.address) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(l.ward.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(l.province.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            ORDER BY l.name ASC
            """)
    List<Location> searchLocationSuggestions(
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("""
            SELECT l
            FROM Location l
            WHERE l.id = :locationId
              AND l.status = com.mapvibe.MapVibe.entity.LocationStatus.ACTIVE
              AND (
                  :categoryId IS NULL
                  OR l.category.id = :categoryId
              )
              AND (
                  :amenityCount = 0
                  OR l.id IN (
                    SELECT l2.id
                    FROM Location l2
                    JOIN l2.amenities a
                    WHERE a.id IN :amenityIds
                    GROUP BY l2.id
                    HAVING COUNT(DISTINCT a.id) = :amenityCount
                  )
              )
            """)
    Page<Location> searchLocationById(
            @Param("locationId") Long locationId,
            @Param("categoryId") Long categoryId,
            @Param("amenityIds") List<Long> amenityIds,
            @Param("amenityCount") int amenityCount,
            Pageable pageable
    );
}
