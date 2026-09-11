package com.example.cosmetics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cosmetics.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByUserIdOrderBySentTimeAsc(Long userId);

    List<Message> findByConversationIdOrderBySentTimeAsc(String conversationId);

    List<Message> findAllByOrderBySentTimeAsc();
}