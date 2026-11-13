package com.lms.borrowingservice.exception;

public class BorrowingLimitException extends RuntimeException {
    public BorrowingLimitException(String message) {
        super(message);
    }
}
