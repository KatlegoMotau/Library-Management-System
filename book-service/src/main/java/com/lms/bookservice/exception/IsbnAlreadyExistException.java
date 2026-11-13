package com.lms.bookservice.exception;

public class IsbnAlreadyExistException extends RuntimeException {
    public IsbnAlreadyExistException(String message) {
        super(message);
    }
}
