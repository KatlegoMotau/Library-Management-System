package com.lms.bookservice.service;

import com.lms.bookservice.dto.BookRequestDTO;
import com.lms.bookservice.dto.BookResponseDTO;
import com.lms.bookservice.exception.BookNotFoundException;
import com.lms.bookservice.exception.IsbnAlreadyExistException;
import com.lms.bookservice.mapper.BookMapper;
import com.lms.bookservice.model.Book;
import com.lms.bookservice.repository.BookRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Add a book
    public BookResponseDTO createBook(BookRequestDTO bookRequestDTO) {

        if(bookRepository.existsByIsbn(bookRequestDTO.getIsbn()))
        {
            throw new IsbnAlreadyExistException("A book with this ISBN already exist: " + bookRequestDTO.getIsbn());
        }

        // Convert the request DTO into a Book entity
        Book newBook = BookMapper.toModel(bookRequestDTO);

        // Save the book in the Book Service database
        Book savedBook = bookRepository.save(newBook);

        return BookMapper.toDTO(savedBook);
    }

    // Get all books
    public List<BookResponseDTO> getBooks() {

        List<Book> books = bookRepository.findAll();

        List<BookResponseDTO> bookResponseDTOs = books.stream()
                .map(book -> BookMapper.toDTO(book)).toList();

        return bookResponseDTOs;
    }

    // Find book by id
    public BookResponseDTO getBookById(Long id) {

        Book book = bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException("Book not found"));

        return BookMapper.toDTO(book);
    }

    // Update book by id
    public BookResponseDTO updateBook(BookRequestDTO bookRequestDTO, Long id) {

        Book existingBook = bookRepository.findById(id).orElseThrow(() ->
                new BookNotFoundException("Book not found with id " + id));

        // Checks whether another book already uses this ISBN.
        if (bookRepository.existsByIsbnAndIdNot(bookRequestDTO.getIsbn(), id))
        {
            throw new IsbnAlreadyExistException("A book with this ISBN already exists: " + bookRequestDTO.getIsbn());
        }

        // Calculates the number of copies currently borrowed
        int borrowedCopies = existingBook.getTotalCopies() - existingBook.getAvailableCopies();

        // Prevents reducing total copies below borrowed copies
        if (bookRequestDTO.getTotalCopies() < borrowedCopies)
        {
            throw new IllegalArgumentException("Total copies cannot be less than the number of borrowed copies: " + borrowedCopies);
        }

        // Updates book information
        existingBook.setIsbn(bookRequestDTO.getIsbn());
        existingBook.setTitle(bookRequestDTO.getTitle());
        existingBook.setAuthor(bookRequestDTO.getAuthor());
        existingBook.setCategory(bookRequestDTO.getCategory());
        existingBook.setTotalCopies(bookRequestDTO.getTotalCopies());

        // Preserves the number of borrowed copies.
        existingBook.setAvailableCopies(bookRequestDTO.getTotalCopies() - borrowedCopies);

        Book updatedBook = bookRepository.save(existingBook);

        return BookMapper.toDTO(updatedBook);
    }

    // Delete a book
    public void deleteBook(Long id) {

        if(!bookRepository.existsById(id))
        {
            throw new BookNotFoundException("Book not found with id " + id);
        }

        bookRepository.deleteById(id);
    }

    // Checks book availability
    public BookResponseDTO checkAvailability(Long id) {

        Book book = bookRepository.findById(id).orElseThrow(() ->
                new BookNotFoundException("Book not found with id " + id));

        return BookMapper.toDTO(book);
    }

    // Decreases available copies when a book is borrowed
    @Transactional
    public BookResponseDTO borrowCopy(Long id) {

        Book book = bookRepository.findByIdWithLock(id).orElseThrow(() ->
                new BookNotFoundException("Book not found with id " + id));

        if(book.getAvailableCopies() <= 0)
        {
            throw new IllegalArgumentException("No available copies of this book");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);

        Book updatedBook = bookRepository.save(book);

        return BookMapper.toDTO(updatedBook);
    }

    // Increases available copies when a book is returned
    @Transactional
    public BookResponseDTO returnCopy(Long id) {

        Book book = bookRepository.findById(id).orElseThrow(() ->
                new BookNotFoundException("Book not found with id " + id));

        if(book.getAvailableCopies() >= book.getTotalCopies())
        {
            throw new IllegalArgumentException("All copies of this book are already available");
        }

        book.setAvailableCopies(book.getAvailableCopies() + 1);

        Book updatedBook = bookRepository.save(book);

        return BookMapper.toDTO(updatedBook);
    }
}
