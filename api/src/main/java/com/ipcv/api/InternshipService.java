package com.ipcv.api;

import com.ipcv.InternshipNotFoundException;
import com.ipcv.dto.InternshipDto;
import com.ipcv.dto.InternshipListItemDto;
import com.ipcv.dto.PageDto;
import com.ipcv.repository.InternshipsRepository;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class InternshipService {
    private final InternshipsRepository internshipsRepository;

    public InternshipDto findById(Long id) {
        return internshipsRepository.findById(id).orElseThrow(() -> new InternshipNotFoundException(id));
    }

    public PageDto<InternshipListItemDto> listPaged(int page, int size, String q, String tech) {
        return internshipsRepository.findPage(page, size, q, tech);
    }

}
