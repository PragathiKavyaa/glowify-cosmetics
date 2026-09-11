package com.example.cosmetics.controller;

import com.example.cosmetics.entity.User;
import com.example.cosmetics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class RegisterController {

    private final UserService service;

    RegisterController(UserService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return service.register(user);

    }

}