package com.ipcv.api;

import com.ipcv.InternshipNotFoundException;
import com.ipcv.dto.ApplicationStatus;
import com.ipcv.dto.InternshipDto;
import com.ipcv.dto.InternshipListItemDto;
import com.ipcv.dto.InternshipState;
import com.ipcv.dto.PageDto;
import com.ipcv.dto.Scope;
import com.ipcv.repository.InternshipsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class InternshipService {
    private final InternshipsRepository internshipsRepository;

    public InternshipDto findById(Long id) {
        return internshipsRepository.findById(id).orElseThrow(() -> new InternshipNotFoundException(id));
    }

    public PageDto<InternshipListItemDto> listPaged(int page,
                                                    int size,
                                                    String q,
                                                    InternshipState internshipState,
                                                    Scope scope,
                                                    String keycloakId,
                                                    ApplicationStatus applicationStatus) {
        if (page < 0) {
            page = 0;
        }
        if (scope == null) {
            scope = Scope.ALL;
        }
        if (scope == Scope.ALL) {
            applicationStatus = null;
        }
        return internshipsRepository.findPage(page, size, q, internshipState, scope, keycloakId, applicationStatus);
    }

}
