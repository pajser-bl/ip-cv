package com.ipbolt.dto;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "promotions", schema = "ipbolt")
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {
    @Id
    private Long id;
    private String type;                 // 'PROMOTION','ANNOUNCEMENT'
    private String name;
    private String description;
    private LocalDateTime announcementTimestamp;
    private LocalDateTime startTimestamp;
    private LocalDateTime endTimestamp;
    private BigDecimal discount;
    private Long createdBy;
    private LocalDateTime createdAt;
}
