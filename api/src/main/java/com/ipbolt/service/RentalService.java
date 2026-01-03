package com.ipbolt.service;

import com.ipbolt.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;

}
