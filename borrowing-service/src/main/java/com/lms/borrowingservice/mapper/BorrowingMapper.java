package com.lms.borrowingservice.mapper;

import com.lms.borrowingservice.dto.BorrowingRequestDTO;
import com.lms.borrowingservice.dto.BorrowingResponseDTO;
import com.lms.borrowingservice.model.Borrowing;

public class BorrowingMapper {

    // Converts Borrowing entity to BorrowingResponseDTO
    public static BorrowingResponseDTO toDTO(Borrowing borrowing) {

        BorrowingResponseDTO borrowingDTO = new BorrowingResponseDTO();

        borrowingDTO.setId(borrowing.getId());
        borrowingDTO.setMemberId(borrowing.getMemberId());
        borrowingDTO.setBookId(borrowing.getBookId());
        borrowingDTO.setBorrowingDate(borrowing.getBorrowingDate());
        borrowingDTO.setDueDate(borrowing.getDueDate());
        borrowingDTO.setReturnDate(borrowing.getReturnDate());
        borrowingDTO.setStatus(borrowing.getStatus());

        return borrowingDTO;
    }

    // Converts BorrowingRequestDTO to Borrowing entity
    public static Borrowing toModel(BorrowingRequestDTO borrowingRequestDTO) {

        Borrowing borrowing = new Borrowing();

        borrowing.setMemberId(borrowingRequestDTO.getMemberId());
        borrowing.setBookId(borrowingRequestDTO.getBookId());

        return borrowing;
    }
}
