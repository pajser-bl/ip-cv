package com.ipcv.api;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentMeController {
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
                "sub", jwt.getSubject(),
                "username", jwt.getClaim("preferred_username"),
                "email", jwt.getClaim("email"),
                "firstName", jwt.getClaim("given_name"),
                "lastName", jwt.getClaim("family_name")
        );
    }
}