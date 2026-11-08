package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findByLocationId(Long locationId, Pageable pageable);

    long countByLocationId(Long locationId);

    List<Review> findByLocationId(Long locationId);

    Page<Review> findByUserId(String userId, Pageable pageable);

    boolean existsByUserIdAndLocationId(String userId, Long locationId);

    @Query("""
            SELECT AVG(r.rating)
            FROM Review r
            WHERE r.location.id = :locationId
            """)
    Double getAverageRatingByLocationId(@Param("locationId") Long locationId);
}