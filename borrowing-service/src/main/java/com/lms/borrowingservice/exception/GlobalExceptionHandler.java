
package com.lms.borrowingservice.exception;

import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles book not found exceptions
    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleBookNotFound(BookNotFoundException exception) {

        return createErrorResponse(HttpStatus.NOT_FOUND, "Book not found", exception.getMessage());
    }

    // Handles borrowing limit exceptions
    @ExceptionHandler(BorrowingLimitException.class)
    public ResponseEntity<Map<String, Object>> handleBorrowingLimit(BorrowingLimitException exception) {

        return createErrorResponse(HttpStatus.NOT_ACCEPTABLE, "Borrowing limit exceeded", exception.getMessage());
    }

    // Handles inactive member exceptions
    @ExceptionHandler(MemberNotActiveException.class)
    public ResponseEntity<Map<String, Object>> handleMemberNotActive(MemberNotActiveException exception) {

        return createErrorResponse(HttpStatus.FORBIDDEN, "Member account is not activated", exception.getMessage());
    }

    // Handles member not found exceptions
    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleMemberNotFound(MemberNotFoundException exception) {

        return createErrorResponse(HttpStatus.NOT_FOUND, "Member not found", exception.getMessage());
    }

    // Handles invalid arguments
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException exception) {

        return createErrorResponse(
                HttpStatus.BAD_REQUEST, "Invalid request", exception.getMessage());
    }

    // Handles exceptions received through gRPC communication
    @ExceptionHandler(StatusRuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleGrpcException(StatusRuntimeException exception) {

        Status.Code grpcCode = exception.getStatus().getCode();

        HttpStatus httpStatus = HttpStatus.BAD_GATEWAY;

        if(grpcCode == Status.Code.NOT_FOUND)
        {
            httpStatus = HttpStatus.NOT_FOUND;

        }
        else if(grpcCode == Status.Code.INVALID_ARGUMENT)
        {
            httpStatus = HttpStatus.BAD_REQUEST;

        }
        else if(grpcCode == Status.Code.FAILED_PRECONDITION)
        {
            httpStatus = HttpStatus.CONFLICT;

        }
        else if(grpcCode == Status.Code.UNAVAILABLE)
        {
            httpStatus = HttpStatus.SERVICE_UNAVAILABLE;

        }
        else if (grpcCode == Status.Code.DEADLINE_EXCEEDED)
        {
            httpStatus = HttpStatus.GATEWAY_TIMEOUT;

        }
        else if (grpcCode == Status.Code.PERMISSION_DENIED)
        {
            httpStatus = HttpStatus.FORBIDDEN;

        }
        else if(grpcCode == Status.Code.UNAUTHENTICATED)
        {
            httpStatus = HttpStatus.UNAUTHORIZED;
        }

        String message = exception.getStatus().getDescription();

        if(message == null || message.isBlank())
        {
            message = grpcCode.name();
        }

        return createErrorResponse(httpStatus, "gRPC communication error", message);
    }

    // Builds a consistent error response
    private ResponseEntity<Map<String, Object>> createErrorResponse(HttpStatus status, String error, String message) {

        Map<String, Object> response = new HashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", error);
        response.put("message", message);

        return ResponseEntity.status(status).body(response);
    }

    // Handles borrowing ownership violations
    @ExceptionHandler(BorrowingAccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleBorrowingAccessDenied(BorrowingAccessDeniedException exception) {

        return createErrorResponse(HttpStatus.FORBIDDEN, "Access denied", exception.getMessage());
    }
}
