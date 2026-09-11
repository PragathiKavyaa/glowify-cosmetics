package com.example.cosmetics.service;

import com.example.cosmetics.dto.LoginRequest;
import com.example.cosmetics.entity.User;
import com.example.cosmetics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;

    UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User register(User user) {

        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        return repository.save(user);
    }

    public User login(LoginRequest request) {

        return repository.findByEmailAndPassword(
                request.getEmail(),
                request.getPassword()).orElse(null);

    }

}