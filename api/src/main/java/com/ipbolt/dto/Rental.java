package com.ipbolt.dto;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "rentals", schema = "ipbolt")
@NoArgsConstructor
@AllArgsConstructor
public class Rental {
    @Id
    private Long id;
    private Long vehicleId;
    private Long userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
    private BigDecimal price;
}
