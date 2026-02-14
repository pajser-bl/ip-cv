package com.ipcv.dto;

import jakarta.persistence.Column;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record InternshipDto(
        Long id,
        @Column(name = "company_id")
        String companyName,
        String title,
        String description,
        List<String> technologies,
        LocalDate startDate,
        LocalDate endDate,
        String additionalRequirements,
        LocalDateTime createdAt
) {
}
