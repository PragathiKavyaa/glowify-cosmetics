package com.example.cosmetics.service;

import com.example.cosmetics.dto.CheckoutRequest;
import com.example.cosmetics.entity.Cart;
import com.example.cosmetics.entity.Order;
import com.example.cosmetics.entity.OrderItem;
import com.example.cosmetics.entity.OrderStatus;
import com.example.cosmetics.repository.CartRepository;
import com.example.cosmetics.repository.OrderRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository,
            CartRepository cartRepository) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Order placeOrder(CheckoutRequest request) {

        System.out.println("User ID from request = " + request.getUserId());
        List<Cart> cartItems = cartRepository.findByUserId(request.getUserId());

        System.out.println("Cart Items Found = " + cartItems.size());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();

        order.setFirstName(request.getFirstName());
        order.setLastName(request.getLastName());
        order.setMobile(request.getMobile());
        order.setEmail(request.getEmail());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPincode(request.getPincode());

        order.setUserId(request.getUserId());

        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingMethod(request.getShippingMethod());

        order.setOrderDate(LocalDate.now());
        order.setEstimatedDelivery(LocalDate.now().plusDays(7));
        order.setOrderStatus(OrderStatus.ORDER_CONFIRMED);

        double subtotal = 0;

        for (Cart cart : cartItems) {

            OrderItem item = new OrderItem();

            item.setProductId(cart.getProductId());
            item.setProductName(cart.getProductName());
            item.setImage(cart.getImage());
            item.setPrice(cart.getPrice());
            item.setQuantity(cart.getQuantity());

            item.setOrder(order);

            order.getItems().add(item);

            subtotal += cart.getPrice() * cart.getQuantity();

        }

        double gst = subtotal * 0.18;

        order.setSubtotal(subtotal);
        order.setShippingCharge(request.getShippingCharge());
        order.setGst(gst);
        order.setTotal(subtotal + gst + request.getShippingCharge());

        Order savedOrder = orderRepository.save(order);

        cartRepository.deleteByUserId(request.getUserId());

        return savedOrder;

    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

}