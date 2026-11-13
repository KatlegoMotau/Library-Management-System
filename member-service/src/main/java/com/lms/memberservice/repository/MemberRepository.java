package com.lms.memberservice.repository;

import com.lms.memberservice.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByEmail(String email);

    boolean existsByContact(String contact);

    boolean existsByMemberNumber(String memberNumber);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByContactAndIdNot(String contact, Long id);

    Optional<Member> findByEmail(String email);
}
