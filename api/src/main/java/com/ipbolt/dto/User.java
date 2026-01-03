package com.ipbolt.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users", schema = "ipbolt")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//    @Column(nullable=false, unique = true)
    private String username;
//    @Column(name="password_hash", nullable=false)
    private String passwordHash;
//    @Column(name="first_name", nullable=false)
    private String firstName;
//    @Column(name="last_name", nullable=false)
    private String lastName;
//    @Column(nullable=false, unique = true)
    private String email;
    private String phone;
//    @Column(name = "id_card_number")
    private String idCardNumber;
//    @Column(name = "passport_number")
    private String passportNumber;
//    @Column(name = "driving_license_number")
    private String drivingLicenseNumber;
    private String role;            // e.g., 'ADMIN','OPERATOR','MANAGER','CLIENT'
    private Boolean blocked;
//    @Column(name = "avatar_url")
    private String avatarUrl;
    private LocalDateTime createdAt;
    private Long createdBy;         // references users (id)
    private LocalDateTime modifiedAt;
    private Long modifiedBy;        // references users (id)
}