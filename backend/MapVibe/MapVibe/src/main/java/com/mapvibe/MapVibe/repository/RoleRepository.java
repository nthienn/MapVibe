package com.mapvibe.MapVibe.repository;

import com.mapvibe.MapVibe.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    @Query("""
            SELECT COUNT(DISTINCT r)
            FROM Role r
            JOIN r.permissions p
            WHERE p.name = :permissionName
            """)
    long countRolesByPermissionName(@Param("permissionName") String permissionName);
}
