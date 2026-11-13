package com.lms.borrowingservice.service;

import com.lms.borrowingservice.client.BookClient;
import com.lms.borrowingservice.client.MemberClient;
import com.lms.borrowingservice.client.dto.BookResponseDTO;
import com.lms.borrowingservice.client.dto.MemberResponseDTO;
import com.lms.borrowingservice.dto.BorrowingRequestDTO;
import com.lms.borrowingservice.dto.BorrowingResponseDTO;
import com.lms.borrowingservice.enums.BorrowingStatus;
import com.lms.borrowingservice.exception.*;
import com.lms.borrowingservice.mapper.BorrowingMapper;
import com.lms.borrowingservice.model.Borrowing;
import com.lms.borrowingservice.repository.BorrowingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final MemberClient memberClient;
    private final BookClient bookClient;

    public BorrowingService(BorrowingRepository borrowingRepository, MemberClient memberClient, BookClient bookClient) {
        this.borrowingRepository = borrowingRepository;
        this.memberClient = memberClient;
        this.bookClient = bookClient;
    }

    // Verifies that a member owns the borrowing record
    private void verifyOwnership(Borrowing borrowing, Long memberId) {

        if(!borrowing.getMemberId().equals(memberId))
        {
            throw new BorrowingAccessDeniedException("You are not allowed to access this borrowing record");
        }
    }

    // Prevents a member from borrowing the same ISBN more than once
    private void verifyNoDuplicateIsbn(Long memberId, String requestedIsbn, String token) {

        // Gets the member's active borrowing statuses
        List<BorrowingStatus> activeStatuses = List.of(BorrowingStatus.BORROWED, BorrowingStatus.OVERDUE);

        // Retrieves the member's active borrowing records
        List<Borrowing> activeBorrowings = borrowingRepository.findByMemberIdAndStatusIn(memberId, activeStatuses);

        // Checks the ISBN of each book already borrowed
        for(Borrowing existingBorrowing : activeBorrowings)
        {
            BookResponseDTO existingBook = bookClient.getBookAvailability(existingBorrowing.getBookId(), token);

            // Compares ISBNs, ignoring spaces and hyphens
            String existingIsbn = existingBook.getIsbn().replaceAll("[\\s-]", "");

            String newIsbn = requestedIsbn.replaceAll("[\\s-]", "");

            if(existingIsbn.equalsIgnoreCase(newIsbn))
            {
                throw new IllegalArgumentException("You already have an active borrowing for this book");
            }
        }
    }

    // Borrows a book
    public BorrowingResponseDTO borrowBook(BorrowingRequestDTO requestDTO, String token) {

        // Checks whether the member exists
        MemberResponseDTO member = memberClient.getMemberById(requestDTO.getMemberId(), token);

        if(member == null)
        {
            throw new MemberNotFoundException("Member does not exist");
        }

        // Checks whether the member is active
        if(!member.isStatus())
        {
            throw new MemberNotActiveException("Member is not active");
        }

        // Defines the statuses that count as active borrowings
        List<BorrowingStatus> activeStatuses = List.of(BorrowingStatus.BORROWED, BorrowingStatus.OVERDUE);

        // Checks the member's active borrowing count
        long activeBorrowings =
                borrowingRepository.countByMemberIdAndStatusIn(requestDTO.getMemberId(), activeStatuses);

        if(activeBorrowings >= 3)
        {
            throw new BorrowingLimitException("Member has reached the maximum limit of 3 active borrowings");
        }

        // Checks whether the book exists and has available copies
        BookResponseDTO book = bookClient.getBookAvailability(requestDTO.getBookId(), token);

        if(book == null)
        {
            throw new BookNotFoundException("Book does not exist");
        }

        if(book.getAvailableCopies() == null || book.getAvailableCopies() == 0)
        {
            throw new BookNotFoundException("No available copies of this book");
        }

        // Prevents borrowing another copy of the same ISBN
        verifyNoDuplicateIsbn(requestDTO.getMemberId(), book.getIsbn(), token);

        // Reserves one copy through Book Service
        bookClient.borrowCopy(requestDTO.getBookId(), token);

        // Creates the borrowing record
        Borrowing borrowing = BorrowingMapper.toModel(requestDTO);

        LocalDate borrowingDate = LocalDate.now();

        borrowing.setBorrowingDate(borrowingDate);
        borrowing.setDueDate(borrowingDate.plusDays(14));
        borrowing.setStatus(BorrowingStatus.BORROWED);

        // Saves the borrowing record
        try
        {
            Borrowing savedBorrowing = borrowingRepository.save(borrowing);

            return BorrowingMapper.toDTO(savedBorrowing);

        }
        catch(RuntimeException exception)
        {

            // Restores the book copy if saving the record fails
            try
            {
                bookClient.returnCopy(requestDTO.getBookId(), token);

            }
            catch(RuntimeException compensationException)
            {
                exception.addSuppressed(compensationException);
            }

            throw exception;
        }
    }

    // ADMIN: Return any borrowing record
    public BorrowingResponseDTO returnBook(Long borrowingId, String token) {

        Borrowing borrowing = borrowingRepository.findById(borrowingId).orElseThrow(() ->
                        new IllegalArgumentException("Borrowing record not found with ID: " + borrowingId));

        return processReturn(borrowing, token);
    }

    // MEMBER: Return only their own borrowing record
    public BorrowingResponseDTO returnBook(Long borrowingId, Long memberId, String token) {

        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Borrowing record not found with ID: " + borrowingId));

        // Verify that this borrowing belongs to the authenticated member
        verifyOwnership(borrowing, memberId);

        return processReturn(borrowing, token);
    }

    // Shared return logic
    private BorrowingResponseDTO processReturn(Borrowing borrowing, String token) {

        // Checks whether the book has already been returned
        if(borrowing.getStatus() == BorrowingStatus.RETURNED)
        {
            throw new IllegalArgumentException("This book has already been returned");
        }

        // Confirms that the borrowing is active
        if(borrowing.getStatus() != BorrowingStatus.BORROWED && borrowing.getStatus() != BorrowingStatus.OVERDUE)
        {
            throw new IllegalArgumentException("This borrowing record cannot be returned");
        }

        // Restores one available copy through Book Service
        bookClient.returnCopy(borrowing.getBookId(), token);

        // Updates the borrowing record
        borrowing.setReturnDate(LocalDate.now());
        borrowing.setStatus(BorrowingStatus.RETURNED);

        // Saves the updated borrowing record
        try
        {
            Borrowing updatedBorrowing = borrowingRepository.save(borrowing);

            return BorrowingMapper.toDTO(updatedBorrowing);

        }
        catch(RuntimeException exception)
        {

            // Attempts to reverse the inventory update if saving fails
            try
            {
                bookClient.borrowCopy(borrowing.getBookId(), token);

            }
            catch(RuntimeException compensationException)
            {
                exception.addSuppressed(compensationException);
            }

            throw exception;
        }
    }

    // Gets all borrowing records
    public List<BorrowingResponseDTO> getBorrowings() {

        List<Borrowing> borrowings = borrowingRepository.findAll();

        return borrowings.stream().map(BorrowingMapper::toDTO).toList();
    }

    // Gets a borrowing record by ID
    public BorrowingResponseDTO getBorrowingById(Long id) {

        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Borrowing record not found with ID: " + id));

        return BorrowingMapper.toDTO(borrowing);
    }

    // MEMBER: Gets a borrowing record only if it belongs to them
    public BorrowingResponseDTO getBorrowingById(Long id, Long memberId) {

        Borrowing borrowing = borrowingRepository.findById(id).orElseThrow(() ->
                        new IllegalArgumentException("Borrowing record not found with ID: " + id));

        // Verify ownership
        verifyOwnership(borrowing, memberId);

        return BorrowingMapper.toDTO(borrowing);
    }

    // Identifies and updates overdue borrowings
    public List<BorrowingResponseDTO> updateOverdueBorrowings() {

        // Gets today's date
        LocalDate today = LocalDate.now();

        // Finds borrowed books whose due dates have passed
        List<Borrowing> overdueBorrowings = borrowingRepository.findByStatusAndDueDateBefore(
                BorrowingStatus.BORROWED, today);

        // Updates their statuses
        for(Borrowing borrowing : overdueBorrowings)
        {
            borrowing.setStatus(BorrowingStatus.OVERDUE);
        }

        // Saves updated borrowing records
        List<Borrowing> updatedBorrowings = borrowingRepository.saveAll(overdueBorrowings);

        // Converts entities into response DTOs
        return updatedBorrowings.stream().map(BorrowingMapper::toDTO).toList();
    }

    // Gets all borrowing records belonging to a member
    public List<BorrowingResponseDTO> getBorrowingsByMemberId(Long memberId) {

        List<Borrowing> borrowings = borrowingRepository.findByMemberId(memberId);

        return borrowings.stream().map(BorrowingMapper::toDTO).toList();
    }

    // Gets active borrowing records belonging to a member
    public List<BorrowingResponseDTO> getActiveBorrowingsByMemberId(Long memberId) {

        List<BorrowingStatus> activeStatuses = List.of(BorrowingStatus.BORROWED, BorrowingStatus.OVERDUE);

        List<Borrowing> borrowings = borrowingRepository.findByMemberIdAndStatusIn(memberId, activeStatuses);

        return borrowings.stream().map(BorrowingMapper::toDTO).toList();
    }
}
