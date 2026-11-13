package com.lms.bookservice.controller;

import com.lms.bookservice.dto.BookRequestDTO;
import com.lms.bookservice.dto.BookResponseDTO;
import com.lms.bookservice.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping("/create")
    public ResponseEntity<BookResponseDTO> createBook(@Valid @RequestBody BookRequestDTO bookRequestDTO) {

        BookResponseDTO bookResponseDTO = bookService.createBook(bookRequestDTO);

        return ResponseEntity.ok().body(bookResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getBooks() {

        List<BookResponseDTO> books = bookService.getBooks();

        return ResponseEntity.ok().body(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getBook(@PathVariable Long id) {

        BookResponseDTO bookResponseDTO = bookService.getBookById(id);

        return ResponseEntity.ok().body(bookResponseDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BookResponseDTO> updateBook(@PathVariable Long id, @Valid @RequestBody BookRequestDTO bookRequestDTO) {

        BookResponseDTO bookResponseDTO = bookService.updateBook(bookRequestDTO, id);

        return ResponseEntity.ok().body(bookResponseDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {

        bookService.deleteBook(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/availability/{id}")
    public ResponseEntity<BookResponseDTO> checkAvailability(@PathVariable Long id) {

        BookResponseDTO bookResponseDTO = bookService.checkAvailability(id);

        return ResponseEntity.ok().body(bookResponseDTO);
    }

    @PostMapping("/borrow-copy/{id}")
    public ResponseEntity<BookResponseDTO> borrowCopy(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.borrowCopy(id));
    }

    @PostMapping("/return-copy/{id}")
    public ResponseEntity<BookResponseDTO> returnCopy(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.returnCopy(id));
    }
}
