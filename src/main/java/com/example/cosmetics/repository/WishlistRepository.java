package com.example.cosmetics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.cosmetics.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserId(Long userId);

}