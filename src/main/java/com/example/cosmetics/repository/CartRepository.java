package com.example.cosmetics.repository;

import com.example.cosmetics.entity.Cart;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByProductIdAndUserId(Long productId, Long userId);

    List<Cart> findByUserId(Long userId);

    @Transactional
    @Modifying
    void deleteByUserId(Long userId);
}