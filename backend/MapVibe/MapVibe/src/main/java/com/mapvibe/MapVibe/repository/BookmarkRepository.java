package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.entity.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByUserIdAndLocationId(String userId, Long locationId);

    Optional<Bookmark> findByUserIdAndLocationId(String userId, Long locationId);

    Page<Bookmark> findByUserId(String userId, Pageable pageable);

    long countByLocationId(Long locationId);

    @Query("""
            SELECT b.location.id
            FROM Bookmark b
            WHERE b.user.id = :userId
            AND b.location.id IN :locationIds
            """)
    Set<Long> findBookmarkedLocationIds(
            @Param("userId") String userId,
            @Param("locationIds") List<Long> locationIds
    );

    void deleteByLocationId(Long locationId);
}
