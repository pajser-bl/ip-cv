package com.ipbolt.dto;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "manufacturers", schema = "ipbolt")
@NoArgsConstructor
@AllArgsConstructor
public class Manufacturer {
    @Id
    private Long id;
    private String name;
    private String country;
    private String address;
    private String phone;
    private String email;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime modifiedAt;
    private Long modifiedBy;
}
