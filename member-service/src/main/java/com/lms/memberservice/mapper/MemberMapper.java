package com.lms.memberservice.mapper;

import com.lms.memberservice.dto.MemberRequestDTO;
import com.lms.memberservice.dto.MemberResponseDTO;
import com.lms.memberservice.model.Member;

public class MemberMapper {

    // Convert Member entity into MemberResponseDTO
    public static MemberResponseDTO toDTO(Member member) {

        MemberResponseDTO memberDTO = new MemberResponseDTO();

        memberDTO.setId(member.getId());
        memberDTO.setFirstName(member.getFirstName());
        memberDTO.setLastName(member.getLastName());
        memberDTO.setMemberNumber(member.getMemberNumber());
        memberDTO.setEmail(member.getEmail());
        memberDTO.setContact(member.getContact());
        memberDTO.setStatus(member.isStatus());

        return memberDTO;
    }

    // Convert MemberRequestDTO into Member entity
    public static Member toModel(MemberRequestDTO memberRequestDTO) {

        Member member = new Member();

        member.setFirstName(memberRequestDTO.getFirstName());
        member.setLastName(memberRequestDTO.getLastName());
        member.setEmail(memberRequestDTO.getEmail());
        member.setContact(memberRequestDTO.getContact());

        return member;
    }
}
