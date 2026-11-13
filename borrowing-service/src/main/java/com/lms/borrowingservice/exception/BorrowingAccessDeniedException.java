package com.lms.borrowingservice.exception;

public class BorrowingAccessDeniedException extends RuntimeException {

    public BorrowingAccessDeniedException(String message) {
        super(message);
    }
}
