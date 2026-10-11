package com.alvarozamora.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public final class SiteDtos {

    private SiteDtos() {
    }

    public record SiteResponse(
            String brandName,
            String brandTagline,
            String logoText,
            Hero hero,
            About about,
            Contact contact,
            String footerText,
            List<Social> socials) {

        public record Hero(String title, String subtitle, String image) {
        }

        public record About(String title, String text, String image) {
        }

        public record Contact(String email, String phone, String location) {
        }

        public record Social(Long id, String label, String url) {
        }
    }

    public record SiteUpdateRequest(
            @NotBlank(message = "El nombre de marca es obligatorio") @Size(max = 120, message = "El nombre de marca no puede superar 120 caracteres") String brandName,
            @NotBlank(message = "El tagline es obligatorio") @Size(max = 160, message = "El tagline no puede superar 160 caracteres") String brandTagline,
            @NotBlank(message = "El monograma es obligatorio") @Size(max = 20, message = "El monograma no puede superar 20 caracteres") String logoText,
            HeroUpdate hero,
            AboutUpdate about,
            ContactUpdate contact,
            @Size(max = 300, message = "El texto del footer no puede superar 300 caracteres") String footerText,
            List<SocialUpdate> socials) {

        public record HeroUpdate(
                @NotBlank(message = "El título del hero es obligatorio") @Size(max = 160, message = "El título del hero no puede superar 160 caracteres") String title,
                @NotBlank(message = "El subtítulo del hero es obligatorio") @Size(max = 300, message = "El subtítulo del hero no puede superar 300 caracteres") String subtitle,
                @Size(max = 255) String image) {
        }

        public record AboutUpdate(@Size(max = 160) String title, String text, @Size(max = 255) String image) {
        }

        public record ContactUpdate(
                @Size(max = 160, message = "El email no puede superar 160 caracteres") String email,
                @Size(max = 60, message = "El teléfono no puede superar 60 caracteres") String phone,
                @Size(max = 160, message = "La ubicación no puede superar 160 caracteres") String location) {
        }

        // Sin @NotBlank: el editor permite filas vacías y ContentService las descarta.
        public record SocialUpdate(Long id, @Size(max = 60) String label, @Size(max = 300) String url) {
        }
    }
}
