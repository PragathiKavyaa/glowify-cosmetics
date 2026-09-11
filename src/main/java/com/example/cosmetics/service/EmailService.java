package com.example.cosmetics.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.example.cosmetics.service.EmailService;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender sender;

    public void sendOffer(String to, String title) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(to);
        mail.setSubject("New Offer Available");
        mail.setText(
                "Hi,\n\nA new offer has been added.\n\n"
                        + title
                        + "\n\nVisit Glowify to shop now!");

        sender.send(mail);
    }
}