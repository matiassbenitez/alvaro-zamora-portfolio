package com.alvarozamora.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class LikeDtos {

    private LikeDtos() {
    }

    public record LikeRequest(
            @NotBlank(message = "El token de visitante es obligatorio") @Size(max = 64) String visitorToken) {
    }

    public record LikeResponse(Long projectId, int likeCount) {
    }
}
