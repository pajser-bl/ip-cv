package com.ipbolt.dto;

import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "vehicles", schema = "ipbolt")
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    private Long id;
    private String externalId;
    private String type;           // 'CAR','BIKE','SCOOTER'
    private Long manufacturerId;
    private String model;
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private String description;    // For cars
    private Integer range;         // For bikes
    private Integer maxSpeed;      // For scooters
    private BigDecimal rentPrice;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime modifiedAt;
    private Long modifiedBy;
}
