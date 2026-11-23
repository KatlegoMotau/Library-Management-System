package com.lms.bookservice.repository;

import com.lms.bookservice.model.BookHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookHistoryRepository extends JpaRepository<BookHistory, Long> {

    // Find the saved previous details of a book
    Optional<BookHistory> findByBookId(Long bookId);

}