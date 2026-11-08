package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.entity.PricingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PricingItemRepository extends JpaRepository<PricingItem, Long> {
    List<PricingItem> findByLocationIdAndPricingCategoryIsNull(Long locationId);
}
