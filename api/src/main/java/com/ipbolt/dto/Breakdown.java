package com.ipbolt.dto;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "breakdowns", schema = "ipbolt")
@NoArgsConstructor
@AllArgsConstructor
public class Breakdown {
    @Id
    private Long id;
    private Long vehicleId;
    private String description;
    private LocalDateTime fixedAt;
    private LocalDateTime reportedAt;
    private Long reportedBy;
}
