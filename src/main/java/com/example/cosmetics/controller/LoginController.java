package com.example.cosmetics.controller;

import com.example.cosmetics.dto.LoginRequest;
import com.example.cosmetics.entity.User;
import com.example.cosmetics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class LoginController {

    @Autowired
    private UserService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = service.login(request);

        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid Email or Password");
        }

        return ResponseEntity.ok(user);
    }
}