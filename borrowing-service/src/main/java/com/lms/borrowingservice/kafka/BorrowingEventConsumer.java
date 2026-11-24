package com.lms.borrowingservice.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class BorrowingEventConsumer {

    private static final String DESTINATION = "/topic/admin/activity";

    private final SimpMessagingTemplate messagingTemplate;

    public BorrowingEventConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Receive borrowing events from Kafka
    @KafkaListener(topics = "book-borrowed")
    public void consumeBorrowingEvent(String message) {

        System.out.println("Received borrowing event from Kafka: " + message);

        // Forward the original JSON event to connected admin dashboards
        messagingTemplate.convertAndSend(DESTINATION, message);

        System.out.println("Forwarded borrowing event to admin dashboard.");
    }
}