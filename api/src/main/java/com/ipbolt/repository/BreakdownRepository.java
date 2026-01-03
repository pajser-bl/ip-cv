package com.ipbolt.repository;

import com.ipbolt.dto.Breakdown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BreakdownRepository extends JpaRepository<Breakdown, Long> {
}
