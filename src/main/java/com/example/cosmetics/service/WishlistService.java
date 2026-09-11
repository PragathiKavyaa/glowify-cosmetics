package com.example.cosmetics.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cosmetics.entity.Wishlist;
import com.example.cosmetics.repository.WishlistRepository;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository repository;

    public Wishlist save(Wishlist wishlist) {
        return repository.save(wishlist);
    }

    public List<Wishlist> getWishlist(Long userId) {
        return repository.findByUserId(userId);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}