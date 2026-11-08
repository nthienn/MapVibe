package com.mapvibe.MapVibe.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "administrative_units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdministrativeUnit {

    @Id
    Integer id;

    @Column(name = "full_name")
    String fullName;

    @Column(name = "full_name_en")
    String fullNameEn;

    @Column(name = "short_name")
    String shortName;

    @Column(name = "short_name_en")
    String shortNameEn;

    @Column(name = "code_name")
    String codeName;

    @Column(name = "code_name_en")
    String codeNameEn;
}
