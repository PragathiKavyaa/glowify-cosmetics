package com.example.cosmetics.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.cosmetics.entity.Message;
import com.example.cosmetics.service.MessageService;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin("*")
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    // Customer sends new message
    @PostMapping
    public Message sendMessage(
            @RequestBody Message message) {

        return service.save(message);
    }

    // Admin gets all messages
    @GetMapping
    public List<Message> getMessages() {

        return service.getAllMessages();
    }

    // User gets all their messages
    @GetMapping("/user/{userId}")
    public List<Message> getUserMessages(
            @PathVariable Long userId) {

        return service.getUserMessages(userId);
    }

    // Get one conversation
    @GetMapping("/conversation/{conversationId}")
    public List<Message> getConversation(
            @PathVariable String conversationId) {

        return service.getConversation(conversationId);
    }

    // Admin replies
    @PostMapping("/reply")
    public Message reply(
            @RequestBody Message request) {

        return service.reply(
                request.getConversationId(),
                request.getMessage(),
                request.getOrderId(),
                request.getUserId(),
                request.getCustomerName());
    }
}