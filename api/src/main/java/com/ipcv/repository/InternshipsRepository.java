package com.ipcv.repository;

import com.ipcv.dto.MyInternshipDto;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class InternshipsRepository {
    private static final String FIND_BY_KEYCLOAK_ID = """
                    SELECT
                     i.id AS internship_id,
                     i.title,
                     c.name AS company_name,
                     i.technologies,
                     ia.status
                    FROM
                     ip_cv.students s
                    JOIN
                     ip_cv.internship_applications ia ON ia.student_id = s.id
                    JOIN
                     ip_cv.internships i ON i.id = ia.internship_id
                    JOIN
                     ip_cv.companies c ON c.id = i.company_id
                    WHERE
                     s.keycloak_id = :keycloakId
                    ORDER BY
                     i.id DESC
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<MyInternshipDto> findByKeycloakId(String keycloakId) {
        UUID keycloakIdAsUUID = UUID.fromString(keycloakId);
        return jdbcTemplate.query(
                FIND_BY_KEYCLOAK_ID,
                Map.of("keycloakId", keycloakIdAsUUID),
                (rs, rowNum) -> {
                    String tech = rs.getString("technologies");
                    List<String> technologies =
                            (tech == null || tech.isBlank())
                                    ? List.of()
                                    : Arrays.stream(tech.split(","))
                                    .map(String::trim)
                                    .filter(s -> !s.isBlank())
                                    .toList();
                    return new MyInternshipDto(
                            rs.getLong("internship_id"),
                            rs.getString("title"),
                            rs.getString("company_name"),
                            technologies,
                            rs.getString("status")
                    );
                }
        );
    }
}
