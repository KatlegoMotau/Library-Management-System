package com.lms.memberservice.controller;

import com.lms.memberservice.dto.LoginRequestDTO;
import com.lms.memberservice.dto.MemberRequestDTO;
import com.lms.memberservice.dto.MemberResponseDTO;
import com.lms.memberservice.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // Identifies the authenticated member using the JWT email
    private Long getAuthenticatedMemberId(Jwt jwt) {
        var member = memberService.getMemberByEmail(jwt.getSubject());
        return member.getId();
    }

    // Checks whether the authenticated user is an ADMIN
    private boolean isAdmin(Jwt jwt) {
        return "ADMIN".equals(jwt.getClaimAsString("role"));
    }

    // Prevents members from accessing another member's profile
    private void verifyOwnership(Long requestedId, Jwt jwt) {
        Long authenticatedMemberId = getAuthenticatedMemberId(jwt);

        if(!authenticatedMemberId.equals(requestedId))
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not allowed to access another member's profile");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDTO dto) {

        String token = memberService.login(dto);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/create")
    public ResponseEntity<MemberResponseDTO> createMember(@Valid @RequestBody MemberRequestDTO dto) {

        MemberResponseDTO response = memberService.createMember(dto);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MemberResponseDTO>> getMembers() {

        List<MemberResponseDTO> members = memberService.getMembers();

        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberResponseDTO> getMemberById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {

        // Only members need to pass the ownership check
        if(!isAdmin(jwt))
        {
            verifyOwnership(id, jwt);
        }

        MemberResponseDTO response = memberService.getMemberById(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MemberResponseDTO> updateMember(@PathVariable Long id, @Valid @RequestBody MemberRequestDTO dto, @AuthenticationPrincipal Jwt jwt) {

        // Only members need to pass the ownership check
        if(!isAdmin(jwt))
        {
            verifyOwnership(id, jwt);
        }

        MemberResponseDTO response = memberService.updateMember(dto, id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/deactivate/{id}")
    public ResponseEntity<MemberResponseDTO> deactivateMember(@PathVariable Long id) {

        MemberResponseDTO response = memberService.deactivateMember(id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/activate/{id}")
    public ResponseEntity<MemberResponseDTO> activateMember(@PathVariable Long id) {

        MemberResponseDTO response = memberService.activateMember(id);

        return ResponseEntity.ok(response);
    }
}
