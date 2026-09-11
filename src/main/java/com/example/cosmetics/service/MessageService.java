package com.example.cosmetics.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cosmetics.entity.Message;
import com.example.cosmetics.repository.MessageRepository;

@Service
public class MessageService {

    private final MessageRepository repository;

    public MessageService(MessageRepository repository) {
        this.repository = repository;
    }

    public Message save(Message message) {

        message.setSentTime(LocalDateTime.now());

        return repository.save(message);
    }

    public List<Message> getAllMessages() {

        return repository.findAllByOrderBySentTimeAsc();
    }

    public List<Message> getUserMessages(Long userId) {

        return repository.findByUserIdOrderBySentTimeAsc(userId);
    }

    public List<Message> getConversation(String conversationId) {

        return repository.findByConversationIdOrderBySentTimeAsc(
                conversationId);
    }

    public Message reply(
            String conversationId,
            String reply,
            Long orderId,
            Long userId,
            String customerName) {

        Message message = new Message();

        message.setConversationId(conversationId);
        message.setOrderId(orderId);
        message.setUserId(userId);
        message.setCustomerName(customerName);

        message.setMessage(reply);

        message.setMessageType("ORDER_MESSAGE");
        message.setSenderRole("ADMIN");

        message.setSentTime(LocalDateTime.now());

        return repository.save(message);
    }
}