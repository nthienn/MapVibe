package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<Ward, String> {
    List<Ward> findByProvinceCodeOrderByNameAsc(String provinceCode);
}
