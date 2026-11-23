package com.lms.bookservice.service;

import com.lms.bookservice.dto.BookRequestDTO;
import com.lms.bookservice.dto.BookResponseDTO;
import com.lms.bookservice.exception.BookNotFoundException;
import com.lms.bookservice.exception.IsbnAlreadyExistException;
import com.lms.bookservice.mapper.BookMapper;
import com.lms.bookservice.model.Book;
import com.lms.bookservice.model.BookHistory;
import com.lms.bookservice.repository.BookHistoryRepository;
import com.lms.bookservice.repository.BookRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BookHistoryRepository bookHistoryRepository;

    public BookService(BookRepository bookRepository, BookHistoryRepository bookHistoryRepository) {
        this.bookRepository = bookRepository;
        this.bookHistoryRepository = bookHistoryRepository;
    }

    // Add a book
    @CacheEvict(value = "books", allEntries = true)
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
    @Cacheable(value = "books", key = "'all'")
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
    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public BookResponseDTO updateBook(BookRequestDTO bookRequestDTO, Long id) {

        Book existingBook = bookRepository.findById(id).orElseThrow(() ->
                new BookNotFoundException("Book not found with id " + id));

        // Checks whether another book already uses this ISBN.
        if(bookRepository.existsByIsbnAndIdNot(bookRequestDTO.getIsbn(), id))
        {
            throw new IsbnAlreadyExistException(
                    "A book with this ISBN already exists: " + bookRequestDTO.getIsbn());
        }

        // Calculates the number of copies currently borrowed.
        int borrowedCopies = existingBook.getTotalCopies() - existingBook.getAvailableCopies();

        // Prevents reducing total copies below borrowed copies.
        if(bookRequestDTO.getTotalCopies() < borrowedCopies)
        {
            throw new IllegalArgumentException(
                    "Total copies cannot be less than the number of borrowed copies: " + borrowedCopies);
        }

        // Save the current details before updating the book.
        BookHistory bookHistory = bookHistoryRepository.findByBookId(id).orElse(new BookHistory());

        bookHistory.setBookId(existingBook.getId());
        bookHistory.setTitle(existingBook.getTitle());
        bookHistory.setAuthor(existingBook.getAuthor());
        bookHistory.setIsbn(existingBook.getIsbn());
        bookHistory.setCategory(existingBook.getCategory());
        bookHistory.setTotalCopies(existingBook.getTotalCopies());

        bookHistoryRepository.save(bookHistory);

        // Update the book information.
        existingBook.setIsbn(bookRequestDTO.getIsbn());
        existingBook.setTitle(bookRequestDTO.getTitle());
        existingBook.setAuthor(bookRequestDTO.getAuthor());
        existingBook.setCategory(bookRequestDTO.getCategory());
        existingBook.setTotalCopies(bookRequestDTO.getTotalCopies());

        // Preserve the number of borrowed copies.
        existingBook.setAvailableCopies(bookRequestDTO.getTotalCopies() - borrowedCopies);

        Book updatedBook = bookRepository.save(existingBook);

        return BookMapper.toDTO(updatedBook);
    }

    // Restore the previous details of a book
    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public BookResponseDTO restorePreviousDetails(Long id) {

        // Find the current book.
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id " + id));

        // Find the saved previous details.
        BookHistory bookHistory = bookHistoryRepository.findByBookId(id)
                .orElseThrow(() -> new IllegalArgumentException("No previous details available for this book"));

        // Check whether another book currently uses the previous ISBN.
        if(bookRepository.existsByIsbnAndIdNot(bookHistory.getIsbn(), id))
        {
            throw new IsbnAlreadyExistException(
                    "Cannot restore because another book is using this ISBN: " + bookHistory.getIsbn());
        }

        // Calculate the number of copies currently borrowed.
        int borrowedCopies = existingBook.getTotalCopies() - existingBook.getAvailableCopies();

        // Prevent restoring a total copy count below borrowed copies.
        if(bookHistory.getTotalCopies() < borrowedCopies)
        {
            throw new IllegalArgumentException(
                    "Cannot restore previous details because the previous total copies are fewer than the currently borrowed copies.");
        }

        // Restore the previous descriptive details.
        existingBook.setTitle(bookHistory.getTitle());
        existingBook.setAuthor(bookHistory.getAuthor());
        existingBook.setIsbn(bookHistory.getIsbn());
        existingBook.setCategory(bookHistory.getCategory());
        existingBook.setTotalCopies(bookHistory.getTotalCopies());

        // Preserve the current borrowing situation.
        existingBook.setAvailableCopies(bookHistory.getTotalCopies() - borrowedCopies);

        // Save the restored book.
        Book restoredBook = bookRepository.save(existingBook);

        // Remove the history record after successful restoration.
        bookHistoryRepository.delete(bookHistory);

        return BookMapper.toDTO(restoredBook);
    }

    // Delete a book
    @CacheEvict(value = "books", allEntries = true)
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
    @CacheEvict(value = "books", allEntries = true)
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
    @CacheEvict(value = "books", allEntries = true)
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
