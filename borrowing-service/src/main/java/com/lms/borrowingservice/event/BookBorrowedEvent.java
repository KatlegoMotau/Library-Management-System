package com.lms.borrowingservice.event;

public class BookBorrowedEvent {

    private Long borrowingId;
    private Long bookId;
    private Long memberId;
    private String event;

    public BookBorrowedEvent(Long borrowingId, Long bookId, Long memberId) {
        this.borrowingId = borrowingId;
        this.bookId = bookId;
        this.memberId = memberId;
        this.event = "BOOK_BORROWED";
    }

    public Long getBorrowingId() {
        return borrowingId;
    }

    public Long getBookId() {
        return bookId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public String getEvent() {
        return event;
    }
}