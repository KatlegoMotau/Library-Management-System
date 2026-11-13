package com.lms.borrowingservice.exception;

public class MemberNotActiveException extends RuntimeException {
    public MemberNotActiveException(String message) {
        super(message);
    }
}
