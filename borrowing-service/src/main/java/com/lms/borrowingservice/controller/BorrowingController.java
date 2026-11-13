package com.lms.borrowingservice.controller;

import com.lms.borrowingservice.client.MemberClient;
import com.lms.borrowingservice.client.dto.MemberResponseDTO;
import com.lms.borrowingservice.dto.BorrowingRequestDTO;
import com.lms.borrowingservice.dto.BorrowingResponseDTO;
import com.lms.borrowingservice.service.BorrowingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;
    private final MemberClient memberClient;

    public BorrowingController(BorrowingService borrowingService, MemberClient memberClient) {
        this.borrowingService = borrowingService;
        this.memberClient = memberClient;
    }

    // Retrieves the authenticated member using their JWT email
    private MemberResponseDTO getAuthenticatedMember(Jwt jwt) {
        return memberClient.getMemberByEmail(jwt.getSubject(), jwt.getTokenValue());
    }

    // Checks whether the authenticated user is an ADMIN
    private boolean isAdmin(Jwt jwt) {

        return "ADMIN".equals(jwt.getClaimAsString("role"));
    }

    // Borrow a book
    @PostMapping("/borrow")
    public ResponseEntity<BorrowingResponseDTO> borrowBook(@Valid @RequestBody BorrowingRequestDTO requestDTO, @AuthenticationPrincipal Jwt jwt) {

        // Members can only borrow using their own member ID
        if(!isAdmin(jwt))
        {
            MemberResponseDTO member = getAuthenticatedMember(jwt);

            requestDTO.setMemberId(member.getId());
        }

        BorrowingResponseDTO responseDTO = borrowingService.borrowBook(requestDTO, jwt.getTokenValue());

        return ResponseEntity.ok(responseDTO);
    }

    // Return a borrowed book
    @PutMapping("/return/{borrowingId}")
    public ResponseEntity<BorrowingResponseDTO> returnBook(@PathVariable Long borrowingId, @AuthenticationPrincipal Jwt jwt) {

        BorrowingResponseDTO responseDTO;

        if(isAdmin(jwt))
        {
            // ADMIN can return any borrowing record
            responseDTO = borrowingService.returnBook(borrowingId, jwt.getTokenValue());
        }
        else
        {
            // MEMBER can only return their own borrowing record
            MemberResponseDTO member = getAuthenticatedMember(jwt);

            responseDTO = borrowingService.returnBook(borrowingId, member.getId(), jwt.getTokenValue());
        }

        return ResponseEntity.ok(responseDTO);
    }

    // Get all borrowing records
    @GetMapping
    public ResponseEntity<List<BorrowingResponseDTO>> getBorrowings() {

        List<BorrowingResponseDTO> borrowings = borrowingService.getBorrowings();

        return ResponseEntity.ok(borrowings);
    }

    // Get a borrowing record by ID
    @GetMapping("/{id}")
    public ResponseEntity<BorrowingResponseDTO> getBorrowingById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {

        BorrowingResponseDTO responseDTO;

        if(isAdmin(jwt))
        {
            // ADMIN can view any borrowing record
            responseDTO = borrowingService.getBorrowingById(id);

        }
        else
        {
            // MEMBER can only view their own borrowing record
            MemberResponseDTO member = getAuthenticatedMember(jwt);

            responseDTO = borrowingService.getBorrowingById(id, member.getId());
        }

        return ResponseEntity.ok(responseDTO);
    }

    // Checks and update overdue borrowing records
    @PutMapping("/overdue")
    public ResponseEntity<List<BorrowingResponseDTO>> updateOverdueBorrowings() {

        List<BorrowingResponseDTO> overdueBorrowings = borrowingService.updateOverdueBorrowings();

        return ResponseEntity.ok(overdueBorrowings);
    }

    // Get borrowing history for a member
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<BorrowingResponseDTO>> getBorrowingsByMemberId(@PathVariable Long memberId, @AuthenticationPrincipal Jwt jwt) {

        if(!isAdmin(jwt))
        {
            // Ignore the supplied ID and use the authenticated member's ID
            MemberResponseDTO member = getAuthenticatedMember(jwt);

            memberId = member.getId();
        }

        List<BorrowingResponseDTO> borrowings = borrowingService.getBorrowingsByMemberId(memberId);

        return ResponseEntity.ok(borrowings);
    }

    // Get active borrowing history for a member
    @GetMapping("/member/{memberId}/active")
    public ResponseEntity<List<BorrowingResponseDTO>> getActiveBorrowingsByMemberId(@PathVariable Long memberId, @AuthenticationPrincipal Jwt jwt) {

        if(!isAdmin(jwt))
        {
            // Ignore the supplied ID and use the authenticated member's ID
            MemberResponseDTO member = getAuthenticatedMember(jwt);

            memberId = member.getId();
        }

        List<BorrowingResponseDTO> borrowings = borrowingService.getActiveBorrowingsByMemberId(memberId);

        return ResponseEntity.ok(borrowings);
    }
}
