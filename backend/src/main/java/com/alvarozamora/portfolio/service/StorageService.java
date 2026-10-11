package com.alvarozamora.portfolio.service;

import com.alvarozamora.portfolio.exception.ApiException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class StorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp", "svg");

    private final Path uploadDir;

    public StorageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    void init() throws IOException {
        Files.createDirectories(uploadDir);
        log.info("Directorio de uploads: {}", uploadDir);
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("Debe adjuntar un archivo");
        }
        String original = file.getOriginalFilename() == null ? "imagen" : file.getOriginalFilename();
        String extension = extensionOf(original);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw ApiException.badRequest("Tipo de archivo no permitido. Use: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
        String filename = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ApiException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar la imagen");
        }
        return "/uploads/" + filename;
    }

    public String copyFromClasspath(String resourcePath, String preferredName) {
        try (InputStream in = getClass().getResourceAsStream(resourcePath)) {
            if (in == null) {
                log.warn("Recurso de seed no encontrado: {}", resourcePath);
                return null;
            }
            String filename = preferredName;
            Path target = uploadDir.resolve(filename);
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException e) {
            log.warn("No se pudo copiar el recurso seed {}", resourcePath, e);
            return null;
        }
    }

    public void deleteByUrl(String url) {
        if (url == null || !url.startsWith("/uploads/")) {
            return;
        }
        String filename = url.substring("/uploads/".length());
        if (filename.contains("/") || filename.contains("..")) {
            return;
        }
        try {
            Files.deleteIfExists(uploadDir.resolve(filename));
        } catch (IOException e) {
            log.warn("No se pudo eliminar el archivo {}", filename, e);
        }
    }

    public Resource load(String filename) throws IOException {
        Path file = uploadDir.resolve(filename).normalize();
        if (!file.startsWith(uploadDir)) {
            throw ApiException.badRequest("Ruta inválida");
        }
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists()) {
            throw ApiException.notFound("Imagen no encontrada");
        }
        return resource;
    }

    private String extensionOf(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot < 0 ? "" : filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}
