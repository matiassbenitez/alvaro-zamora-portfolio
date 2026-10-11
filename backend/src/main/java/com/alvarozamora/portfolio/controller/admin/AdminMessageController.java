package com.alvarozamora.portfolio.controller.admin;

import com.alvarozamora.portfolio.dto.MessageDtos;
import com.alvarozamora.portfolio.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/messages")
public class AdminMessageController {

    private final MessageService messageService;

    @GetMapping
    public List<MessageDtos.MessageResponse> list(@RequestParam(defaultValue = "false") boolean unreadOnly) {
        return messageService.list(unreadOnly);
    }

    @PatchMapping("/{id}/read")
    public MessageDtos.MessageResponse markRead(@PathVariable Long id,
                                                @RequestBody MessageDtos.MessageReadRequest request) {
        return messageService.markRead(id, Boolean.TRUE.equals(request.read()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        messageService.delete(id);
    }
}
