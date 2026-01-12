package com.ipcv.repository;

import com.ipcv.dto.InternshipDto;
import org.springframework.data.repository.CrudRepository;

public interface InternshipsRepository extends CrudRepository<InternshipDto, Integer> {

}
