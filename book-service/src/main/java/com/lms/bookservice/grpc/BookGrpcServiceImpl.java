package com.lms.bookservice.grpc;

import com.lms.bookservice.dto.BookResponseDTO;
import com.lms.bookservice.service.BookService;
import io.grpc.stub.StreamObserver;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
public class BookGrpcServiceImpl extends BookGrpcServiceGrpc.BookGrpcServiceImplBase {

    private final BookService bookService;

    public BookGrpcServiceImpl(BookService bookService) {
        this.bookService = bookService;
    }

    // Checks book availability
    @Override
    public void getBookAvailability(BookRequest request, StreamObserver<BookResponse> responseObserver) {

        BookResponseDTO book = bookService.checkAvailability(request.getBookId());

        BookResponse response = convertToGrpcResponse(book);

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    // Reduces available copies when borrowing
    @Override
    public void borrowCopy(BookRequest request, StreamObserver<BookResponse> responseObserver) {

        BookResponseDTO book = bookService.borrowCopy(request.getBookId());

        BookResponse response = convertToGrpcResponse(book);

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    // Increases available copies when returning
    @Override
    public void returnCopy(BookRequest request, StreamObserver<BookResponse> responseObserver) {

        BookResponseDTO book = bookService.returnCopy(request.getBookId());

        BookResponse response = convertToGrpcResponse(book);

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    // Converts the existing DTO into a gRPC response
    private BookResponse convertToGrpcResponse(BookResponseDTO book) {

        return BookResponse.newBuilder()
                .setId(book.getId())
                .setTitle(book.getTitle())
                .setAuthor(book.getAuthor())
                .setIsbn(book.getIsbn())
                .setCategory(book.getCategory())
                .setTotalCopies(book.getTotalCopies())
                .setAvailableCopies(book.getAvailableCopies())
                .setAvailable(book.isAvailable())
                .build();
    }
}
