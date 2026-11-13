package com.lms.borrowingservice.repository;

import com.lms.borrowingservice.enums.BorrowingStatus;
import com.lms.borrowingservice.model.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {

    // Counts borrowings by member and status
    long countByMemberIdAndStatusIn(Long memberId, java.util.Collection<BorrowingStatus> statuses);

    // Checks whether a book is currently borrowed by a member
    boolean existsByMemberIdAndBookIdAndStatusIn(Long memberId, Long bookId, java.util.Collection<BorrowingStatus> statuses);

    // Used to update eligible records from borrowed to overdue
    List<Borrowing> findByStatusAndDueDateBefore(BorrowingStatus status, LocalDate date);

    List<Borrowing> findByMemberId(Long memberId);

    // Gets only active borrowings for a particular member (borrowed or overdue)
    List<Borrowing> findByMemberIdAndStatusIn(Long memberId, java.util.Collection<BorrowingStatus> statuses);
}

