package com.example.cosmetics.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cosmetics.entity.CancelOrder;
import com.example.cosmetics.service.CancelOrderService;

@RestController
@RequestMapping("/api/cancel-orders")
@CrossOrigin("*")
public class CancelOrderController {

    private final CancelOrderService service;

    public CancelOrderController(CancelOrderService service) {
        this.service = service;
    }

    // @PostMapping("/save")
    // public CancelOrder save(@RequestBody CancelOrder request) {
    // return service.save(request);
    // }

    @GetMapping
    public List<CancelOrder> getAll() {
        return service.getAllRequests();
    }

    @PutMapping("/{id}/approve")
    public CancelOrder approve(@PathVariable Long id) {
        return service.approve(id);
    }

    @PutMapping("/{id}/reject")
    public CancelOrder reject(@PathVariable Long id) {
        return service.reject(id);
    }

    @PostMapping("/request")
    public ResponseEntity<CancelOrder> requestCancellation(
            @RequestBody CancelOrder request) {

        return ResponseEntity.ok(
                service.requestCancellation(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CancelOrder>> getCancelledOrders(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getCancelledOrders(userId));
    }
}