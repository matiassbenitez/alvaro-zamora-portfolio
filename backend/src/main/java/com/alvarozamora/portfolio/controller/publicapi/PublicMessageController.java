package com.alvarozamora.portfolio.controller.publicapi;

import com.alvarozamora.portfolio.dto.MessageDtos;
import com.alvarozamora.portfolio.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/messages")
public class PublicMessageController {

    private final MessageService messageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageDtos.MessageResponse create(@Valid @RequestBody MessageDtos.MessageRequest request) {
        return messageService.create(request);
    }
}
