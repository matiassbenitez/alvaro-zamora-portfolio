package com.alvarozamora.portfolio.controller.admin;

import com.alvarozamora.portfolio.dto.UploadResponse;
import com.alvarozamora.portfolio.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/upload")
public class AdminUploadController {

    private final StorageService storageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UploadResponse upload(@RequestParam(value = "file", required = false) MultipartFile file) {
        return new UploadResponse(storageService.store(file));
    }
}
