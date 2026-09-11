package com.example.cosmetics.service;

import com.example.cosmetics.entity.Cart;
import com.example.cosmetics.entity.Product;
import com.example.cosmetics.repository.CartRepository;
import com.example.cosmetics.repository.ProductRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository repository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository repository,
            ProductRepository productRepository) {

        this.repository = repository;
        this.productRepository = productRepository;
    }

    // =========================================================
    // ADD TO CART
    // =========================================================
    @Transactional
    public Cart addToCart(Cart cart) {

        // ==============================
        // VALIDATE USER ID
        // ==============================

        if (cart.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        // ==============================
        // VALIDATE PRODUCT ID
        // ==============================

        if (cart.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }

        // ==============================
        // GET PRODUCT FROM DATABASE
        // ==============================

        Product product = productRepository.findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException(
                        "Product not found with ID: "
                                + cart.getProductId()));

        // ==============================
        // SET PRODUCT DETAILS
        // ==============================

        cart.setProductName(product.getName());

        if (cart.getImage() == null || cart.getImage().isBlank()) {
            cart.setImage(product.getImage());
        }

        // ==============================
        // CHECK EXISTING CART ITEM
        // ==============================

        Optional<Cart> existing = repository.findByProductIdAndUserId(
                cart.getProductId(),
                cart.getUserId());

        // ==============================
        // EXISTING PRODUCT
        // ==============================

        if (existing.isPresent()) {

            Cart dbCart = existing.get();

            // ==============================
            // BUY 1 GET 1 FREE
            // ==============================

            if ("BUY_ONE_GET_ONE".equals(cart.getOfferType())) {

                int currentQuantity = dbCart.getQuantity();

                dbCart.setQuantity(currentQuantity + 2);

                dbCart.setBuyQuantity(1);
                dbCart.setFreeQuantity(1);

            }

            // ==============================
            // 50% / PERCENTAGE OFFER
            // ==============================

            else {

                int quantity = cart.getQuantity() <= 0
                        ? 1
                        : cart.getQuantity();

                int currentQuantity = dbCart.getQuantity();

                dbCart.setQuantity(currentQuantity + quantity);
            }

            // ==============================
            // UPDATE OFFER INFORMATION
            // ==============================

            dbCart.setOfferId(cart.getOfferId());
            dbCart.setOfferType(cart.getOfferType());
            dbCart.setOriginalPrice(cart.getOriginalPrice());
            dbCart.setDiscountAmount(cart.getDiscountAmount());
            dbCart.setFinalPrice(cart.getFinalPrice());

            return repository.save(dbCart);
        }

        // ==============================
        // NEW CART ITEM
        // ==============================

        if (cart.getQuantity() <= 0) {
            cart.setQuantity(1);
        }

        // ==============================
        // BUY 1 GET 1 FREE
        // ==============================

        if ("BUY_ONE_GET_ONE".equals(cart.getOfferType())) {

            cart.setQuantity(2);

            cart.setBuyQuantity(1);
            cart.setFreeQuantity(1);
        }

        // ==============================
        // SAVE CART
        // ==============================

        return repository.save(cart);
    }
    // =========================================================
    // INCREASE QUANTITY
    // =========================================================

    @Transactional
    public Cart increaseQuantity(Long id) {

        Cart cart = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Product product = productRepository
                .findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // =====================================================
        // BOGO
        // =====================================================

        if ("BUY_ONE_GET_ONE".equals(cart.getOfferType())) {

            // BOGO needs 2 physical products
            int additionalQuantity = 2;

            if (product.getStock() < additionalQuantity) {

                throw new RuntimeException(
                        "Not enough stock. Only "
                                + product.getStock()
                                + " item(s) available.");
            }

            cart.setQuantity(
                    cart.getQuantity() + 2);

            product.setStock(
                    product.getStock() - 2);

        }

        // =====================================================
        // NORMAL / 50% OFFER
        // =====================================================

        else {

            if (product.getStock() < 1) {

                throw new RuntimeException(
                        "Product is out of stock");
            }

            cart.setQuantity(
                    cart.getQuantity() + 1);

            product.setStock(
                    product.getStock() - 1);
        }

        productRepository.save(product);

        return repository.save(cart);
    }

    // =========================================================
    // DECREASE QUANTITY
    // =========================================================

    @Transactional
    public Cart decreaseQuantity(Long id) {

        Cart cart = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Product product = productRepository
                .findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // =====================================================
        // BOGO
        // =====================================================

        if ("BUY_ONE_GET_ONE".equals(cart.getOfferType())) {

            if (cart.getQuantity() > 2) {

                // Return 2 items to stock
                cart.setQuantity(
                        cart.getQuantity() - 2);

                product.setStock(
                        product.getStock() + 2);

                productRepository.save(product);

                return repository.save(cart);
            }

            // Quantity is 2 → remove entire BOGO item
            product.setStock(
                    product.getStock() + cart.getQuantity());

            productRepository.save(product);

            repository.delete(cart);

            return null;
        }

        // =====================================================
        // NORMAL / 50% OFFER
        // =====================================================

        if (cart.getQuantity() > 1) {

            cart.setQuantity(
                    cart.getQuantity() - 1);

            // Return one item to stock
            product.setStock(
                    product.getStock() + 1);

            productRepository.save(product);

            return repository.save(cart);
        }

        // Quantity = 1 → remove item
        product.setStock(
                product.getStock() + 1);

        productRepository.save(product);

        repository.delete(cart);

        return null;
    }

    // =========================================================
    // DELETE ITEM
    // =========================================================

    @Transactional
    public void deleteItem(Long id) {

        Cart cart = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Product product = productRepository
                .findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Return all reserved physical quantity
        product.setStock(
                product.getStock() + cart.getQuantity());

        productRepository.save(product);

        repository.delete(cart);
    }

    // =========================================================
    // CLEAR CART
    // =========================================================

    @Transactional
    public void clearCart(Long userId) {

        List<Cart> cartItems = repository.findByUserId(userId);

        for (Cart cart : cartItems) {

            Product product = productRepository
                    .findById(cart.getProductId())
                    .orElse(null);

            if (product != null) {

                product.setStock(
                        product.getStock() + cart.getQuantity());

                productRepository.save(product);
            }
        }

        repository.deleteAll(cartItems);
    }

    // =========================================================
    // GET CART BY USER
    // =========================================================

    public List<Cart> getCartByUser(Long userId) {

        return repository.findByUserId(userId);
    }

    public List<Cart> getAllCartItems() {
        return repository.findAll();
    }
}