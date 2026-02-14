package com.ipcv.api;

import com.ipcv.dto.InternshipDto;
import com.ipcv.dto.InternshipListItemDto;
import com.ipcv.dto.PageDto;
import java.util.List;
import lombok.AllArgsConstructor;
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
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tech
    ) {
        return internshipService.listPaged(page, size, q, tech);
    }

    @GetMapping("/{id}")
    public InternshipDto byId(@PathVariable Long id) {
        return internshipService.findById(id);
    }


}
