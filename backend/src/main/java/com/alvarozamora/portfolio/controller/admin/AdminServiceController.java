package com.alvarozamora.portfolio.controller.admin;

import com.alvarozamora.portfolio.dto.ServiceDtos;
import com.alvarozamora.portfolio.entity.ServiceEntity;
import com.alvarozamora.portfolio.exception.ApiException;
import com.alvarozamora.portfolio.repository.ServiceEntityRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/services")
public class AdminServiceController {

    private final ServiceEntityRepository repository;

    @GetMapping
    public List<ServiceDtos.ServiceResponse> list() {
        return repository.findAllByOrderBySortOrderAsc().stream().map(this::toResponse).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceDtos.ServiceResponse create(@Valid @RequestBody ServiceDtos.ServiceRequest request) {
        ServiceEntity entity = ServiceEntity.builder()
                .title(request.title().trim())
                .description(request.description())
                .icon(request.icon())
                .sortOrder(request.sortOrder() == null ? 0 : request.sortOrder())
                .active(request.active() == null || request.active())
                .build();
        return toResponse(repository.save(entity));
    }

    @PutMapping("/{id}")
    public ServiceDtos.ServiceResponse update(@PathVariable Long id, @Valid @RequestBody ServiceDtos.ServiceRequest request) {
        ServiceEntity entity = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Servicio no encontrado"));
        entity.setTitle(request.title().trim());
        entity.setDescription(request.description());
        entity.setIcon(request.icon());
        if (request.sortOrder() != null) {
            entity.setSortOrder(request.sortOrder());
        }
        if (request.active() != null) {
            entity.setActive(request.active());
        }
        return toResponse(repository.save(entity));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw ApiException.notFound("Servicio no encontrado");
        }
        repository.deleteById(id);
    }

    private ServiceDtos.ServiceResponse toResponse(ServiceEntity s) {
        return new ServiceDtos.ServiceResponse(s.getId(), s.getTitle(), s.getDescription(), s.getIcon(), s.getSortOrder(), s.getActive());
    }
}
