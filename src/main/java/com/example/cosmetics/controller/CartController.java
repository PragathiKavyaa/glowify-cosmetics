package com.example.cosmetics.controller;

import com.example.cosmetics.entity.Cart;
import com.example.cosmetics.service.CartService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @PostMapping
    public Cart addCart(@RequestBody Cart cart) {
        System.out.println("Received User ID = " + cart.getUserId());
        return service.addToCart(cart);
    }

    @GetMapping
    public List<Cart> getCartItems() {
        return service.getAllCartItems();
    }

    @PutMapping("/{id}/increase")
    public Cart increase(@PathVariable Long id) {
        return service.increaseQuantity(id);
    }

    @PutMapping("/{id}/decrease")
    public Cart decrease(@PathVariable Long id) {
        return service.decreaseQuantity(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteItem(id);
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {

        service.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    @GetMapping("/user/{userId}")
    public List<Cart> getUserCart(@PathVariable Long userId) {
        return service.getCartByUser(userId);
    }
}