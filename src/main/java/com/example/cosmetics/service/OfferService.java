package com.example.cosmetics.service;

import com.example.cosmetics.dto.OfferResponse;
import com.example.cosmetics.entity.Cart;
import com.example.cosmetics.entity.Offer;
import com.example.cosmetics.entity.Product;
import com.example.cosmetics.repository.CartRepository;
import com.example.cosmetics.repository.OfferRepository;
import com.example.cosmetics.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public Offer saveOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    public Offer updateOffer(Long id, Offer offer) {

        Offer existing = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        existing.setProductId(offer.getProductId());
        existing.setOfferTitle(offer.getOfferTitle());
        existing.setOfferType(offer.getOfferType());
        existing.setDiscountPercent(offer.getDiscountPercent());
        existing.setOfferPrice(offer.getOfferPrice());
        existing.setBuyQuantity(offer.getBuyQuantity());
        existing.setFreeQuantity(offer.getFreeQuantity());
        existing.setStartDate(offer.getStartDate());
        existing.setEndDate(offer.getEndDate());
        existing.setActive(offer.getActive());

        return offerRepository.save(existing);
    }

    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }

    public List<OfferResponse> getActiveOffers() {

        LocalDate today = LocalDate.now();

        List<Offer> offers = offerRepository.findAll();

        List<OfferResponse> response = new ArrayList<>();

        for (Offer offer : offers) {

            if (!offer.getActive())
                continue;

            if (offer.getStartDate() != null &&
                    today.isBefore(offer.getStartDate()))
                continue;

            if (offer.getEndDate() != null &&
                    today.isAfter(offer.getEndDate()))
                continue;

            Product product = productRepository
                    .findById(offer.getProductId())
                    .orElse(null);

            if (product == null)
                continue;

            OfferResponse dto = new OfferResponse();

            dto.setId(offer.getId());

            dto.setProductId(product.getId());

            dto.setProductName(product.getName());

            dto.setProductImage(product.getImage());

            dto.setBrand(product.getBrand());

            dto.setOriginalPrice(product.getPrice());

            dto.setOfferTitle(offer.getOfferTitle());

            dto.setOfferType(offer.getOfferType());

            dto.setDiscountPercent(offer.getDiscountPercent());

            dto.setBuyQuantity(offer.getBuyQuantity());

            dto.setFreeQuantity(offer.getFreeQuantity());

            dto.setActive(offer.getActive());

            if ("PERCENTAGE".equals(offer.getOfferType())) {

                dto.setOfferPrice(offer.getOfferPrice());

            } else {

                dto.setOfferPrice(product.getPrice());

            }

            response.add(dto);

        }

        return response;
    }

    public Cart addOfferToCart(Long offerId, Long userId) {

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        Product product = productRepository.findById(offer.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = new Cart();

        cart.setUserId(userId);

        cart.setProductId(product.getId());

        cart.setProductName(product.getName());

        cart.setImage(product.getImage());

        cart.setOfferId(offer.getId());

        cart.setOfferType(offer.getOfferType());

        cart.setOriginalPrice(product.getPrice());

        if ("PERCENTAGE".equals(offer.getOfferType())) {

            // double discount = product.getPrice() * offer.getDiscountPercent() / 100.0;
            // double finalPrice = product.getPrice() - discount;

            cart.setFinalPrice(offer.getOfferPrice());

            cart.setDiscountAmount(
                    product.getPrice() - offer.getOfferPrice());

            cart.setQuantity(1);
            cart.setOriginalPrice(product.getPrice());
            cart.setPrice(offer.getOfferPrice());

            // cart.setPrice(finalPrice); // <-- IMPORTANT

            // cart.setDiscountAmount(discount);
            // cart.setFinalPrice(finalPrice);
        }

        else if ("BUY_ONE_GET_ONE".equals(offer.getOfferType())) {

            cart.setQuantity(2);

            cart.setBuyQuantity(offer.getBuyQuantity());
            cart.setFreeQuantity(offer.getFreeQuantity());

            cart.setPrice(product.getPrice()); // Amount customer pays
            cart.setOriginalPrice(product.getPrice());

            cart.setDiscountAmount(product.getPrice());
            cart.setFinalPrice(product.getPrice());
        }

        cartRepository.save(cart);

        return cart;

    }
}