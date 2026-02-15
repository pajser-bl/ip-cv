package com.ipcv.api;

import com.ipcv.dto.ApplicationStatus;
import com.ipcv.dto.InternshipDto;
import com.ipcv.dto.InternshipListItemDto;
import com.ipcv.dto.InternshipState;
import com.ipcv.dto.PageDto;
import com.ipcv.dto.Scope;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internships")
@AllArgsConstructor
public class InternshipsController {
    private final InternshipService internshipService;

    @GetMapping
    public PageDto<InternshipListItemDto> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) InternshipState internshipState,
            @RequestParam(required = false) Scope scope,
            @RequestParam(required = false) ApplicationStatus applicationStatus,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return internshipService.listPaged(
                page,
                size,
                q,
                internshipState,
                scope,
                jwt.getSubject(),
                applicationStatus);
    }

    @GetMapping("/{id}")
    public InternshipDto byId(@PathVariable Long id) {
        return internshipService.findById(id);
    }
}
