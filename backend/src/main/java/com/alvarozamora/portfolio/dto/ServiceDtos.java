package com.alvarozamora.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class ServiceDtos {

    private ServiceDtos() {
    }

    public record ServiceRequest(
            @NotBlank(message = "El título es obligatorio") @Size(max = 120, message = "El título no puede superar 120 caracteres") String title,
            @Size(max = 500, message = "La descripción no puede superar 500 caracteres") String description,
            @Size(max = 60, message = "El icono no puede superar 60 caracteres") String icon,
            Integer sortOrder,
            Boolean active) {
    }

    public record ServiceResponse(
            Long id,
            String title,
            String description,
            String icon,
            Integer sortOrder,
            Boolean active) {
    }
}
