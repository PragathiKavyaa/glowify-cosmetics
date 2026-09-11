package com.example.cosmetics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cosmetics.entity.ContactMessage;
import com.example.cosmetics.service.ContactMessageService;

@RestController
@RequestMapping("/api/contact-messages")
@CrossOrigin("*")
public class ContactMessageController {

    @Autowired
    private ContactMessageService service;

    @PostMapping
    public ContactMessage save(
            @RequestBody ContactMessage message) {

        return service.save(message);
    }

    @GetMapping
    public List<ContactMessage> getAll() {
        return service.getAll();
    }
}
