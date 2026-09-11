package com.example.cosmetics.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cosmetics.entity.Subscriber;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {

    boolean existsByEmail(String email);
}