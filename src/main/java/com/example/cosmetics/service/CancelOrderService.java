package com.example.cosmetics.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cosmetics.entity.CancelOrder;
import com.example.cosmetics.entity.Message;
import com.example.cosmetics.entity.Order;
import com.example.cosmetics.entity.OrderStatus;
import com.example.cosmetics.repository.CancelOrderRepository;
import com.example.cosmetics.repository.MessageRepository;
import com.example.cosmetics.repository.OrderRepository;

@Service
public class CancelOrderService {

        private final CancelOrderRepository cancelOrderRepository;
        private final OrderRepository orderRepository;
        private final MessageRepository messageRepository;

        public CancelOrderService(CancelOrderRepository cancelOrderRepository,
                        OrderRepository orderRepository, MessageRepository messageRepository) {
                this.cancelOrderRepository = cancelOrderRepository;
                this.orderRepository = orderRepository;
                this.messageRepository = messageRepository;
        }

        // User sends cancellation request
        public CancelOrder save(CancelOrder request) {

                System.out.println("========== CANCEL REQUEST ==========");
                System.out.println("Order Id : " + request.getOrderId());
                System.out.println("User Id : " + request.getUserId());
                System.out.println("Reason : " + request.getReason());

                request.setStatus("Pending");
                request.setRequestDate(LocalDateTime.now());

                CancelOrder savedRequest = cancelOrderRepository.save(request);

                System.out.println("Cancel request saved.");

                Order order = orderRepository.findById(request.getOrderId())
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                System.out.println("Order found : " + order.getId());

                order.setOrderStatus(OrderStatus.CANCELLATION_REQUESTED);

                orderRepository.save(order);

                System.out.println("Order updated.");

                return savedRequest;
        }

        // Admin views all cancellation requests
        public List<CancelOrder> getAllRequests() {
                return cancelOrderRepository.findAll();
        }

        // Admin approves cancellation
        public CancelOrder approve(Long id) {

                CancelOrder request = cancelOrderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                request.setStatus("Approved");

                cancelOrderRepository.save(request);

                Order order = orderRepository.findById(request.getOrderId())
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                order.setOrderStatus(OrderStatus.CANCELLED);

                orderRepository.save(order);

                return request;
        }

        // Admin rejects cancellation
        public CancelOrder reject(Long id) {

                CancelOrder request = cancelOrderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Cancellation request not found"));

                // Update cancellation request status
                request.setStatus("Not Approved");

                cancelOrderRepository.save(request);

                // Find original order
                Order order = orderRepository.findById(request.getOrderId())
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // Keep the order active
                order.setOrderStatus(OrderStatus.ORDER_CONFIRMED);

                orderRepository.save(order);

                // Create cancellation notification for user
                Message message = new Message();

                message.setOrderId(request.getOrderId());
                message.setUserId(request.getUserId());
                message.setCustomerName(request.getCustomerName());

                message.setMessage(
                                "Your cancellation request for Order #"
                                                + request.getOrderId()
                                                + " was not approved. "
                                                + "The order will continue processing.");

                message.setMessageType("CANCELLATION_REJECTED");

                message.setSenderRole("ADMIN");

                message.setSentTime(LocalDateTime.now());

                messageRepository.save(message);

                return request;
        }

        public CancelOrder requestCancellation(CancelOrder request) {

                Order order = orderRepository.findByIdAndUserId(
                                request.getOrderId(),
                                request.getUserId()).orElseThrow(() -> new RuntimeException("Order not found"));

                request.setStatus("Pending");
                request.setRequestDate(LocalDateTime.now());

                return cancelOrderRepository.save(request);
        }

        public List<CancelOrder> getCancelledOrders(Long userId) {

                return cancelOrderRepository.findByUserId(userId);
        }
}