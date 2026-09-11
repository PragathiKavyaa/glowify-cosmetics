package com.example.cosmetics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cosmetics.entity.Subscriber;
import com.example.cosmetics.repository.SubscriberRepository;

@RestController
@RequestMapping("/api/subscribers")
@CrossOrigin
public class SubscriberController {

    @Autowired
    private SubscriberRepository repository;

    @PostMapping
    public ResponseEntity<String> subscribe(
            @RequestBody Subscriber subscriber) {

        if (repository.existsByEmail(subscriber.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Email already subscribed");
        }

        subscriber.setRead(false);
        repository.save(subscriber);

        return ResponseEntity.ok("Subscribed Successfully");
    }

    @GetMapping
    public List<Subscriber> getSubscribers() {
        return repository.findAll();
    }

    @PutMapping("/{id}/read")
    public Subscriber markAsRead(@PathVariable Long id) {

        Subscriber subscriber = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscriber not found"));

        subscriber.setRead(true);

        return repository.save(subscriber);
    }
}
