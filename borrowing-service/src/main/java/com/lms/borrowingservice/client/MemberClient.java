package com.lms.borrowingservice.client;

import com.lms.borrowingservice.client.dto.MemberResponseDTO;
import com.lms.memberservice.grpc.GetMemberByIdRequest;
import com.lms.memberservice.grpc.GetMemberByEmailRequest;
import com.lms.memberservice.grpc.MemberGrpcServiceGrpc;
import com.lms.memberservice.grpc.MemberResponse;
import io.grpc.Metadata;
import io.grpc.stub.MetadataUtils;
import org.springframework.stereotype.Component;

@Component
public class MemberClient {

    private final MemberGrpcServiceGrpc.MemberGrpcServiceBlockingStub memberGrpcStub;

    public MemberClient(MemberGrpcServiceGrpc.MemberGrpcServiceBlockingStub memberGrpcStub) {
        this.memberGrpcStub = memberGrpcStub;
    }

    // Attaches the JWT to the gRPC request
    private MemberGrpcServiceGrpc.MemberGrpcServiceBlockingStub getAuthenticatedStub(String token) {

        Metadata headers = new Metadata();

        Metadata.Key<String> authorizationKey = Metadata.Key.of("authorization", Metadata.ASCII_STRING_MARSHALLER);

        headers.put(authorizationKey, "Bearer " + token);

        return memberGrpcStub.withInterceptors(MetadataUtils.newAttachHeadersInterceptor(headers));
    }

    // Retrieve a member using their ID
    public MemberResponseDTO getMemberById(Long memberId, String token) {

        GetMemberByIdRequest request = GetMemberByIdRequest.newBuilder().setMemberId(memberId).build();

        MemberResponse response = getAuthenticatedStub(token).getMemberById(request);

        return convertToDTO(response);
    }

    // Retrieve a member using their email
    public MemberResponseDTO getMemberByEmail(String email, String token) {

        GetMemberByEmailRequest request = GetMemberByEmailRequest.newBuilder().setEmail(email).build();

        MemberResponse response = getAuthenticatedStub(token).getMemberByEmail(request);

        return convertToDTO(response);
    }

    // Convert the gRPC response into the existing DTO
    private MemberResponseDTO convertToDTO(MemberResponse response) {

        MemberResponseDTO member = new MemberResponseDTO();

        member.setId(response.getId());
        member.setFirstName(response.getFirstName());
        member.setLastName(response.getLastName());
        member.setEmail(response.getEmail());
        member.setContact(response.getContact());
        member.setMemberNumber(response.getMemberNumber());
        member.setStatus(response.getStatus());

        return member;
    }
}
