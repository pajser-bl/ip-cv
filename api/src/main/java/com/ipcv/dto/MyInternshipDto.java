package com.ipcv.dto;

import java.util.List;

public record MyInternshipDto(
        Long internshipId,
        String title,
        String companyName,
        List<String> technologies,
        String status
) {
}
