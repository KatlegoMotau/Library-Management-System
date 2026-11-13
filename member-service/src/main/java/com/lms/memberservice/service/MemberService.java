package com.lms.memberservice.service;

import com.lms.memberservice.dto.LoginRequestDTO;
import com.lms.memberservice.dto.MemberRequestDTO;
import com.lms.memberservice.dto.MemberResponseDTO;
import com.lms.memberservice.exception.EmailAlreadyExistsException;
import com.lms.memberservice.exception.ContactAlreadyExistsException;
import com.lms.memberservice.exception.MemberNotFoundException;
import com.lms.memberservice.mapper.MemberMapper;
import com.lms.memberservice.model.Member;
import com.lms.memberservice.model.Role;
import com.lms.memberservice.repository.MemberRepository;
import com.lms.memberservice.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final SecureRandom random = new SecureRandom();

    public MemberService(MemberRepository memberRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // Login a member
    public String login(LoginRequestDTO loginRequestDTO) {

        Member member = memberRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // Checks whether the member is active
        if(!member.isStatus())
        {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Verify the submitted password
        if(!passwordEncoder.matches(loginRequestDTO.getPassword(), member.getPassword()))
        {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Generate JWT token
        return jwtService.generateToken(member.getEmail(), member.getRole().name());
    }


    // Generate a unique membership number
    private String generateMemberNumber() {

        String memberNumber;

        do
        {
            int number = random.nextInt(1_000_000);

            memberNumber = String.format("MEM%06d", number);

        }
        while (memberRepository.existsByMemberNumber(memberNumber));

        return memberNumber;
    }

    // Create a member
    public MemberResponseDTO createMember(MemberRequestDTO memberRequestDTO) {

        if(memberRepository.existsByEmail(memberRequestDTO.getEmail()))
        {
            throw new EmailAlreadyExistsException("A member with this email already exists");
        }

        if(memberRepository.existsByContact(memberRequestDTO.getContact()))
        {
            throw new ContactAlreadyExistsException("A member with this contact number already exists");
        }

        Member newMember = MemberMapper.toModel(memberRequestDTO);

        // Encodes the member's password
        newMember.setPassword(passwordEncoder.encode(memberRequestDTO.getPassword()));

        // Assigns the MEMBER role by default
        newMember.setRole(Role.MEMBER);

        // Generate membership number
        newMember.setMemberNumber(generateMemberNumber());

        // New members are active by default
        newMember.setStatus(true);

        Member savedMember = memberRepository.save(newMember);

        return MemberMapper.toDTO(savedMember);
    }

    // Get all members
    public List<MemberResponseDTO> getMembers() {

        List<Member> members = memberRepository.findAll();

        List<MemberResponseDTO> memberResponseDTOs = members.stream()
                .map(member -> MemberMapper.toDTO(member)).toList();

        return memberResponseDTOs;
    }

    // Get a member by ID
    public MemberResponseDTO getMemberById(Long id) {

        Member member = memberRepository.findById(id).orElseThrow(() -> new MemberNotFoundException(
                "Member not found with ID: " + id));

        return MemberMapper.toDTO(member);
    }


    // Get a member by email
    public MemberResponseDTO getMemberByEmail(String email) {

        Member member = memberRepository.findByEmail(email).orElseThrow(() -> new MemberNotFoundException(
                        "Member not found with email: " + email));

        return MemberMapper.toDTO(member);
    }


    // Update a member
    public MemberResponseDTO updateMember(
            MemberRequestDTO memberRequestDTO, Long id) {

        Member existingMember = memberRepository.findById(id).orElseThrow(() -> new MemberNotFoundException(
                "Member not found with ID: " + id));

        // Checks whether another member uses this email
        if(memberRepository.existsByEmailAndIdNot(memberRequestDTO.getEmail(), id))
        {

            throw new EmailAlreadyExistsException("This email is already registered to another member");
        }

        // Checks whether another member uses this contact number
        if(memberRepository.existsByContactAndIdNot(memberRequestDTO.getContact(), id))
        {

            throw new ContactAlreadyExistsException(
                    "This contact number is already registered to another member");
        }

        existingMember.setFirstName(memberRequestDTO.getFirstName());
        existingMember.setLastName(memberRequestDTO.getLastName());
        existingMember.setEmail(memberRequestDTO.getEmail());
        existingMember.setContact(memberRequestDTO.getContact());

        // Membership number and status remain unchanged

        Member updatedMember = memberRepository.save(existingMember);

        return MemberMapper.toDTO(updatedMember);
    }

    // Deactivate a member
    public MemberResponseDTO deactivateMember(Long id) {

        Member member = memberRepository.findById(id).orElseThrow(() -> new MemberNotFoundException(
                "Member not found with ID: " + id));

        member.setStatus(false);

        Member updatedMember = memberRepository.save(member);

        return MemberMapper.toDTO(updatedMember);
    }

    // Activate a member
    public MemberResponseDTO activateMember(Long id) {

        Member member = memberRepository.findById(id).orElseThrow(() -> new MemberNotFoundException(
                "Member not found with ID: " + id));

        member.setStatus(true);

        Member updatedMember = memberRepository.save(member);

        return MemberMapper.toDTO(updatedMember);
    }
}
