package com.example.cosmetics.controller;

import com.example.cosmetics.dto.OfferResponse;
import com.example.cosmetics.entity.Cart;
import com.example.cosmetics.entity.Offer;
import com.example.cosmetics.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin(origins = "*")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @GetMapping
    public List<Offer> getAllOffers() {
        return offerService.getAllOffers();
    }

    @PostMapping
    public Offer saveOffer(@RequestBody Offer offer) {

        System.out.println("Discount = " + offer.getDiscountPercent());
        System.out.println(offer);

        return offerService.saveOffer(offer);
    }

    @PutMapping("/{id}")
    public Offer updateOffer(@PathVariable Long id,
            @RequestBody Offer offer) {
        return offerService.updateOffer(id, offer);
    }

    @GetMapping("/active")
    public List<OfferResponse> getOffers() {
        return offerService.getActiveOffers();
    }

    @DeleteMapping("/{id}")
    public void deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
    }

    @PostMapping("/cart/{offerId}")
    public Cart addOfferToCart(@PathVariable Long offerId,
            @RequestParam Long userId) {

        return offerService.addOfferToCart(offerId, userId);

    }
}