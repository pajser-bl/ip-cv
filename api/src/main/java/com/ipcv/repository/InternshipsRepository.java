package com.ipcv.repository;

import com.ipcv.dto.InternshipDto;
import com.ipcv.dto.InternshipListItemDto;
import com.ipcv.dto.MyInternshipDto;
import com.ipcv.dto.PageDto;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class InternshipsRepository {

    private static final String FIND_BY_ID = """
                    SELECT
                     i.id,
                     i.title,
                     c.name AS company_name,
                     i.description,
                     i.technologies,
                     i.start_date,
                     i.end_date,
                     i.additional_requirements,
                     i.created_at
                    FROM
                     ip_cv.internships i
                    JOIN
                     ip_cv.companies c ON c.id = i.company_id
                    WHERE
                     i.id = :id
            """;

    private static final String FIND_BY_KEYCLOAK_ID = """
                    SELECT
                     i.id,
                     i.title,
                     c.name AS company_name,
                     i.technologies,
                     i.description,
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

    public PageDto<InternshipListItemDto> findPage(int page, int size, String q) {
        int limit = Math.clamp(size, 1, 50);
        int offset = Math.max(page, 0) * limit;

        String qNorm = (q == null) ? null : q.trim();

        boolean hasQ = qNorm != null && !qNorm.isBlank();

        String where = " WHERE i.active = true ";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("limit", limit)
                .addValue("offset", offset);

        if (hasQ) {
            where += """
                    AND (
                         lower(i.title) LIKE :q
                         OR lower(c.name) LIKE :q
                         OR lower(i.description) LIKE :q
                         OR lower(i.technologies) LIKE :q
                    )
                    """;
            params.addValue("q", "%" + q.toLowerCase() + "%");
        }

        String countSql = """
                SELECT COUNT(*)
                FROM ip_cv.internships i
                JOIN ip_cv.companies c ON c.id = i.company_id
                """ + where;

        Long totalObj = jdbcTemplate.queryForObject(countSql, params, Long.class);
        long total = (totalObj == null) ? 0L : totalObj;

        String dataSql = """
                SELECT
                    i.id,
                    i.title,
                    c.name AS company_name,
                    i.description,
                    i.technologies
                FROM
                    ip_cv.internships i
                JOIN
                    ip_cv.companies c ON c.id = i.company_id
                """ + where + """
                ORDER BY i.id ASC 
                LIMIT :limit
                OFFSET :offset
                """;


        List<InternshipListItemDto> items = jdbcTemplate.query(
                dataSql,
                params,
                (rs, rowNum) ->
                        InternshipListItemDto.builder()
                                .id(rs.getLong("id"))
                                .title(rs.getString("title"))
                                .companyName(rs.getString("company_name"))
                                .description(rs.getString("description"))
                                .technologies(extractTechnologies(rs.getString("technologies")))
                                .build()
        );

        int totalPages = (total == 0) ? 0 : (int) Math.ceil((double) total / limit);
        return new PageDto<>(items, Math.max(page, 0), limit, total, totalPages);
    }

    public List<MyInternshipDto> findByKeycloakId(String keycloakId) {
        UUID keycloakIdAsUUID = UUID.fromString(keycloakId);
        return jdbcTemplate.query(
                FIND_BY_KEYCLOAK_ID,
                Map.of("keycloakId", keycloakIdAsUUID),
                (rs, rowNum) -> MyInternshipDto.builder()
                        .id(rs.getLong("id"))
                        .title(rs.getString("title"))
                        .companyName(rs.getString("company_name"))
                        .description(rs.getString("description"))
                        .technologies(extractTechnologies(rs.getString("technologies")))
                        .status(rs.getString("status"))
                        .build()
        );
    }

    public Optional<InternshipDto> findById(Long id) {
        try {
            InternshipDto internship = jdbcTemplate.queryForObject(
                    FIND_BY_ID,
                    Map.of("id", id),
                    (rs, rowNum) -> InternshipDto.builder()
                            .id(rs.getLong("id"))
                            .companyName(rs.getString("company_name"))
                            .title(rs.getString("title"))
                            .description(rs.getString("description"))
                            .technologies(extractTechnologies(rs.getString("technologies")))
                            .startDate(rs.getDate("start_date").toLocalDate())
                            .endDate(rs.getDate("end_date").toLocalDate())
                            .additionalRequirements(rs.getString("additional_requirements"))
                            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                            .build()
            );
            assert internship != null;
            return Optional.of(internship);
        } catch (EmptyResultDataAccessException ex) {
            return Optional.empty();
        }
    }

    private List<String> extractTechnologies(String technologies) {
        return (technologies == null || technologies.isBlank())
                ? List.of()
                : Arrays.stream(technologies.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }
}
