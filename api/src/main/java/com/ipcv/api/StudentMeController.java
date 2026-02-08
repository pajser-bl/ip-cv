package com.ipcv.api;

import com.ipcv.dto.MyInternshipDto;
import com.ipcv.repository.InternshipsRepository;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentMeController {

    private final InternshipsRepository internshipsRepository;

    public StudentMeController(InternshipsRepository internshipsRepository) {
        this.internshipsRepository = internshipsRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt, Authentication authentication) {
        return Map.of(
                "sub", jwt.getSubject(),
                "username", jwt.getClaim("preferred_username"),
                "email", jwt.getClaim("email"),
                "firstName", jwt.getClaim("given_name"),
                "lastName", jwt.getClaim("family_name")
        );
    }

    @GetMapping("/me/internships")
    public List<MyInternshipDto> myInternships(@AuthenticationPrincipal Jwt jwt) {
        return internshipsRepository.findByKeycloakId(jwt.getSubject());
    }

}