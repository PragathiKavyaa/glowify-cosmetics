package com.example.cosmetics.controller;

import com.example.cosmetics.dto.CheckoutRequest;
import com.example.cosmetics.entity.CancelOrder;
import com.example.cosmetics.entity.Order;
import com.example.cosmetics.entity.OrderItem;
import com.example.cosmetics.entity.OrderStatus;
import com.example.cosmetics.repository.CancelOrderRepository;
import com.example.cosmetics.repository.OrderItemRepository;
import com.example.cosmetics.repository.OrderRepository;
import com.example.cosmetics.service.OrderService;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    private final OrderService service;
    private final OrderRepository repository;
    private final CancelOrderRepository cancelOrderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderController(OrderService service, OrderRepository repository,
            CancelOrderRepository cancelOrderRepository, OrderItemRepository orderItemRepository) {

        this.service = service;
        this.repository = repository;
        this.cancelOrderRepository = cancelOrderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @PostMapping
    public Order placeOrder(@RequestBody CheckoutRequest request) {

        return service.placeOrder(request);

    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {

        return repository.findById(id).orElseThrow();

    }

    @GetMapping("/{orderId}/user/{userId}")
    public Order getOrderByUser(
            @PathVariable Long orderId,
            @PathVariable Long userId) {

        return repository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

    }

    @PutMapping("/{id}/status")
    public Order updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Order order = repository.findById(id).orElseThrow();

        order.setOrderStatus(
                com.example.cosmetics.entity.OrderStatus.valueOf(status));

        return repository.save(order);
    }

    @GetMapping
    public List<Order> getAllOrders() {

        return service.getAllOrders();

    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    // @PostMapping("/api/cancel-orders")
    // public CancelOrder cancelOrder(
    // @RequestBody CancelOrder request) {

    // request.setStatus("Pending");
    // request.setRequestDate(LocalDateTime.now());

    // cancelOrderRepository.save(request);

    // Order order = repository.findById(request.getOrderId()).get();

    // order.setOrderStatus(
    // OrderStatus.CANCELLATION_REQUESTED);

    // repository.save(order);

    // return request;
    // }

    @PutMapping("/api/cancel-orders/{id}/approve")
    public void approveCancel(@PathVariable Long id) {

        CancelOrder request = cancelOrderRepository.findById(id).get();

        request.setStatus("Approved");

        cancelOrderRepository.save(request);

        Order order = repository.findById(request.getOrderId()).get();

        order.setOrderStatus(OrderStatus.CANCELLED);

        repository.save(order);

    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(
            @PathVariable Long orderId) {

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        return ResponseEntity.ok(items);
    }

}