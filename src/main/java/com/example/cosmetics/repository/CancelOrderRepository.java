package com.example.cosmetics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cosmetics.entity.CancelOrder;

public interface CancelOrderRepository extends JpaRepository<CancelOrder, Long> {
    List<CancelOrder> findByUserId(Long userId);
}
