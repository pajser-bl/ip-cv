package com.ipcv.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record InternshipListItemDto(
        Long id,
        String title,
        String companyName,
        String description,
        List<String> technologies,
        ApplicationStatus myStatus, // "APPLIED", "ACCEPTED", "REJECTED"
        Boolean active
) {
}
