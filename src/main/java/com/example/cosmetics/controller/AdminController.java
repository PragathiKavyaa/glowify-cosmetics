package com.example.cosmetics.controller;

import com.example.cosmetics.entity.Order;
import com.example.cosmetics.entity.OrderStatus;
import com.example.cosmetics.entity.Product;
import com.example.cosmetics.entity.Subscriber;
import com.example.cosmetics.repository.OrderRepository;
import com.example.cosmetics.repository.ProductRepository;
import com.example.cosmetics.repository.SubscriberRepository;
import com.example.cosmetics.service.EmailService;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SubscriberRepository subscriberRepository;
    private final EmailService emailService;

    public AdminController(ProductRepository productRepository,
            OrderRepository orderRepository,
            SubscriberRepository subscriberRepository,
            EmailService emailService) {

        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.subscriberRepository = subscriberRepository;
        this.emailService = emailService;
    }

    // ===================== PRODUCTS =====================

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {

        Product savedProduct = productRepository.save(product);

        if (savedProduct.getDiscount() > 0) {

            List<Subscriber> subscribers = subscriberRepository.findAll();

            for (Subscriber subscriber : subscribers) {
                emailService.sendOffer(
                        subscriber.getEmail(),
                        savedProduct.getName());
            }
        }

        return savedProduct;
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id,
            @RequestBody Product product) {

        Product p = productRepository.findById(id).orElseThrow();

        p.setName(product.getName());
        p.setPrice(product.getPrice());
        p.setStock(product.getStock());
        p.setDiscount(product.getDiscount());
        p.setImage(product.getImage());

        return productRepository.save(p);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    // ===================== ORDERS =====================

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {

        Map<String, Object> data = new HashMap<>();

        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        data.put("totalProducts", products.size());
        data.put("totalOrders", orders.size());

        double revenue = orders.stream()
                .mapToDouble(Order::getTotal)
                .sum();

        data.put("totalRevenue", revenue);

        int lowStock = (int) products.stream()
                .filter(p -> p.getStock() < 10)
                .count();

        data.put("lowStock", lowStock);

        int totalStock = products.stream()
                .mapToInt(Product::getStock)
                .sum();

        data.put("totalStock", totalStock);

        int outOfStock = (int) products.stream()
                .filter(p -> p.getStock() == 0)
                .count();

        data.put("outOfStock", outOfStock);

        data.put("todaySales", revenue);

        data.put("monthlySales", revenue);

        int delivered = (int) orders.stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.DELIVERED)
                .count();

        data.put("deliveredOrders", delivered);

        return data;
    }

    @PutMapping("/products/{id}/stock")
    public Product updateStock(
            @PathVariable Long id,
            @RequestParam int stock) {

        Product product = productRepository.findById(id).orElseThrow();

        product.setStock(stock);

        return productRepository.save(product);
    }

    @PutMapping("/products/{id}/price")
    public Product updatePrice(
            @PathVariable Long id,
            @RequestParam double price) {

        Product product = productRepository.findById(id).orElseThrow();

        product.setPrice(price);

        return productRepository.save(product);
    }

    @PutMapping("/products/{id}/discount")
    public Product updateDiscount(
            @PathVariable Long id,
            @RequestParam double discount) {

        Product product = productRepository.findById(id).orElseThrow();

        product.setDiscount(discount);

        return productRepository.save(product);
    }

    @GetMapping("/notifications")
    public List<Map<String, String>> notifications() {

        List<Map<String, String>> list = new ArrayList<>();

        Map<String, String> n1 = new HashMap<>();
        n1.put("message", "New order received");

        Map<String, String> n2 = new HashMap<>();
        n2.put("message", "Low stock alert");

        list.add(n1);
        list.add(n2);

        return list;
    }

}