package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.entity.PricingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PricingOrderRepository extends JpaRepository<PricingOrder, Long> {
    List<PricingOrder> findByLocationIdOrderByDisplayOrderAsc(Long locationId);

    void deleteByLocationId(Long locationId);
}
