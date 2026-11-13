package com.lms.memberservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(nullable = false)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    @Email(message = "Please provide a valid email address")
    private  String email;

    @NotBlank(message = "Contact number is required")
    @Column(unique = true, nullable = false)
    private  String contact;

    @NotBlank(message = "Membership number is required")
    @Column(unique = true, nullable = false)
    private String memberNumber;

    @Column(nullable = false)
    private Boolean status = true;

    @Column
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.MEMBER;

    public Member() {
    }

    public Member(Long id, String firstName, String lastName, String email, String contact, String memberNumber, Boolean status) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.contact = contact;
        this.memberNumber = memberNumber;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public @NotBlank(message = "Memebership number is required") String getMemberNumber() {
        return memberNumber;
    }

    public void setMemberNumber(@NotBlank(message = "Memebership number is required") String memberNumber) {
        this.memberNumber = memberNumber;
    }

    public @NotBlank(message = "Contact number is required") String getContact() {
        return contact;
    }

    public void setContact(@NotBlank(message = "Contact number is required") String contact) {
        this.contact = contact;
    }

    public @NotBlank(message = "Email is required") @Email String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email String email) {
        this.email = email;
    }

    public @NotBlank(message = "Last name is required") String getLastName() {
        return lastName;
    }

    public void setLastName(@NotBlank(message = "Last name is required") String lastName) {
        this.lastName = lastName;
    }

    public @NotBlank(message = "First name is required") String getFirstName() {
        return firstName;
    }

    public void setFirstName(@NotBlank(message = "First name is required") String firstName) {
        this.firstName = firstName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
