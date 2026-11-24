package com.lms.borrowingservice.kafka;

import com.lms.borrowingservice.event.BookBorrowedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Component
public class BorrowingEventProducer {

    private static final String TOPIC = "book-borrowed";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public BorrowingEventProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {

        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    // Publishes a borrowing event to Kafka
    public void publishBookBorrowedEvent(BookBorrowedEvent event) {

        try
        {
            // Convert the Java event object into JSON
            String message = objectMapper.writeValueAsString(event);

            // Send the message to Kafka
            kafkaTemplate.send(TOPIC, event.getBorrowingId().toString(), message
            ).whenComplete((result, exception) -> {

                if(exception != null)
                {
                    System.err.println("Failed to publish borrowing event: " + exception.getMessage());
                }
                else
                {
                    System.out.println("Successfully published borrowing event. "
                                    + "Topic: " + result.getRecordMetadata().topic()
                                    + ", Partition: " + result.getRecordMetadata().partition()
                                    + ", Offset: " + result.getRecordMetadata().offset());
                }
            });

        }
        catch(JacksonException exception)
        {
            throw new IllegalStateException("Failed to convert borrowing event into JSON", exception);
        }
    }
}