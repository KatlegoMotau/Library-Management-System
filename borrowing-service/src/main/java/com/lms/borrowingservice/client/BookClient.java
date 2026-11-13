package com.lms.borrowingservice.client;

import com.lms.borrowingservice.client.dto.BookResponseDTO;
import com.lms.bookservice.grpc.BookGrpcServiceGrpc;
import com.lms.bookservice.grpc.BookRequest;
import com.lms.bookservice.grpc.BookResponse;
import io.grpc.Metadata;
import io.grpc.stub.MetadataUtils;
import org.springframework.stereotype.Component;

@Component
public class BookClient {

    private final BookGrpcServiceGrpc.BookGrpcServiceBlockingStub bookGrpcStub;

    // Defines the metadata key used to send the JWT
    private static final Metadata.Key<String> AUTHORIZATION =
            Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER);

    public BookClient(BookGrpcServiceGrpc.BookGrpcServiceBlockingStub bookGrpcStub) {
        this.bookGrpcStub = bookGrpcStub;
    }

    // Attaches the JWT to the outgoing gRPC request
    private BookGrpcServiceGrpc.BookGrpcServiceBlockingStub authenticatedStub(String token) {

        Metadata headers = new Metadata();

        headers.put(AUTHORIZATION, "Bearer " + token);

        return bookGrpcStub.withInterceptors(MetadataUtils.newAttachHeadersInterceptor(headers));
    }

    // Gets book availability from Book Service using gRPC
    public BookResponseDTO getBookAvailability(Long bookId, String token) {

        BookRequest request = BookRequest.newBuilder().setBookId(bookId).build();

        BookResponse response = authenticatedStub(token).getBookAvailability(request);

        return convertToDTO(response);
    }

    // Reduces available copies when borrowing a book
    public BookResponseDTO borrowCopy(Long bookId, String token) {

        BookRequest request = BookRequest.newBuilder().setBookId(bookId).build();

        BookResponse response = authenticatedStub(token).borrowCopy(request);

        return convertToDTO(response);
    }

    // Increases available copies when returning a book
    public BookResponseDTO returnCopy(Long bookId, String token) {

        BookRequest request = BookRequest.newBuilder().setBookId(bookId).build();

        BookResponse response = authenticatedStub(token).returnCopy(request);

        return convertToDTO(response);
    }

    // Converts the gRPC response into the existing DTO
    private BookResponseDTO convertToDTO(BookResponse response) {

        BookResponseDTO book = new BookResponseDTO();

        book.setId(response.getId());
        book.setTitle(response.getTitle());
        book.setAuthor(response.getAuthor());
        book.setIsbn(response.getIsbn());
        book.setCategory(response.getCategory());
        book.setTotalCopies(response.getTotalCopies());
        book.setAvailableCopies(response.getAvailableCopies());
        book.setAvailable(response.getAvailable());

        return book;
    }
}
