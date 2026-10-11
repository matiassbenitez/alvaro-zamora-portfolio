package com.alvarozamora.portfolio.service;

import com.alvarozamora.portfolio.dto.MessageDtos;
import com.alvarozamora.portfolio.entity.Message;
import com.alvarozamora.portfolio.exception.ApiException;
import com.alvarozamora.portfolio.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageDtos.MessageResponse create(MessageDtos.MessageRequest request) {
        Message message = Message.builder()
                .name(request.name().trim())
                .email(request.email().trim())
                .subject(request.subject() == null ? null : request.subject().trim())
                .body(request.body().trim())
                .readFlag(false)
                .build();
        return toResponse(messageRepository.save(message));
    }

    public List<MessageDtos.MessageResponse> list(boolean unreadOnly) {
        List<Message> messages = unreadOnly
                ? messageRepository.findAllByReadFlagFalseOrderByCreatedAtDesc()
                : messageRepository.findAllByOrderByCreatedAtDesc();
        return messages.stream().map(this::toResponse).toList();
    }

    @Transactional
    public MessageDtos.MessageResponse markRead(Long id, boolean read) {
        Message message = find(id);
        message.setReadFlag(read);
        return toResponse(messageRepository.save(message));
    }

    @Transactional
    public void delete(Long id) {
        messageRepository.delete(find(id));
    }

    private Message find(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Mensaje no encontrado"));
    }

    private MessageDtos.MessageResponse toResponse(Message m) {
        return new MessageDtos.MessageResponse(
                m.getId(), m.getName(), m.getEmail(), m.getSubject(), m.getBody(), m.getReadFlag(), m.getCreatedAt());
    }
}
