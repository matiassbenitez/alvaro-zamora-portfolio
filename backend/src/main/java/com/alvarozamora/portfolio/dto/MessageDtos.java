package com.alvarozamora.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public final class MessageDtos {

    private MessageDtos() {
    }

    public record MessageRequest(
            @NotBlank(message = "El nombre es obligatorio") @Size(max = 120, message = "El nombre no puede superar 120 caracteres") String name,
            @NotBlank(message = "El email es obligatorio") @Email(message = "El email no es válido") @Size(max = 160, message = "El email no puede superar 160 caracteres") String email,
            @Size(max = 160, message = "El asunto no puede superar 160 caracteres") String subject,
            @NotBlank(message = "El mensaje es obligatorio") @Size(max = 5000, message = "El mensaje no puede superar 5000 caracteres") String body) {
    }

    public record MessageResponse(
            Long id,
            String name,
            String email,
            String subject,
            String body,
            Boolean read,
            OffsetDateTime createdAt) {
    }

    public record MessageReadRequest(Boolean read) {
    }
}
