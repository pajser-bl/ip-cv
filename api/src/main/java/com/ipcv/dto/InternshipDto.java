package com.ipcv.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Table(name = "internships", schema = "ip_cv")
@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class InternshipDto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "company_id")
    Integer companyId;

    String title;
    String description;
    String technologies;

    @Column(name = "start_date")
    java.time.LocalDate startDate;

    @Column(name = "end_date")
    java.time.LocalDate endDate;

    @Column(name = "additional_requirements")
    String additionalRequirements;

    Boolean active;

    @Column(name = "created_at")
    java.time.LocalDateTime createdAt;

    @Column(name = "modified_at")
    java.time.LocalDateTime modifiedAt;
}
