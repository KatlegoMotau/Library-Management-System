
package com.lms.bookservice.mapper;

import com.lms.bookservice.dto.BookRequestDTO;
import com.lms.bookservice.dto.BookResponseDTO;
import com.lms.bookservice.model.Book;

public class BookMapper {

    // Convert Book entity into BookResponseDTO
    public static BookResponseDTO toDTO(Book book) {

        BookResponseDTO bookDTO = new BookResponseDTO();

        bookDTO.setId(book.getId());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setIsbn(book.getIsbn());
        bookDTO.setCategory(book.getCategory());
        bookDTO.setTotalCopies(book.getTotalCopies());
        bookDTO.setAvailableCopies(book.getAvailableCopies());

        // Check whether at least one copy is available
        bookDTO.setAvailable(book.getAvailableCopies() > 0);

        return bookDTO;
    }

    // Convert BookRequestDTO into Book entity
    public static Book toModel(BookRequestDTO bookRequestDTO) {

        Book book = new Book();

        book.setTitle(bookRequestDTO.getTitle());
        book.setAuthor(bookRequestDTO.getAuthor());
        book.setIsbn(bookRequestDTO.getIsbn());
        book.setCategory(bookRequestDTO.getCategory());
        book.setTotalCopies(bookRequestDTO.getTotalCopies());

        // Initially, all copies are available.
        book.setAvailableCopies(bookRequestDTO.getTotalCopies());

        return book;
    }
}
