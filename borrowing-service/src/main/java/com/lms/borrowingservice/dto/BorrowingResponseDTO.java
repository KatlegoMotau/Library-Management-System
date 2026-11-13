
package com.lms.borrowingservice.dto;

import com.lms.borrowingservice.enums.BorrowingStatus;

import java.time.LocalDate;

public class BorrowingResponseDTO {

    private Long id;
    private Long memberId;
    private Long bookId;
    private LocalDate borrowingDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private BorrowingStatus status;

    public BorrowingResponseDTO() {
    }

    public BorrowingResponseDTO(Long id, Long memberId, Long bookId, LocalDate borrowingDate, LocalDate dueDate, LocalDate returnDate, BorrowingStatus status) {
        this.id = id;
        this.memberId = memberId;
        this.bookId = bookId;
        this.borrowingDate = borrowingDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public LocalDate getBorrowingDate() {
        return borrowingDate;
    }

    public void setBorrowingDate(LocalDate borrowingDate) {
        this.borrowingDate = borrowingDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public BorrowingStatus getStatus() {
        return status;
    }

    public void setStatus(BorrowingStatus status) {
        this.status = status;
    }
}

