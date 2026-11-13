
package com.lms.memberservice.grpc;

import com.lms.memberservice.service.MemberService;
import io.grpc.stub.StreamObserver;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
public class MemberGrpcServiceImpl extends MemberGrpcServiceGrpc.MemberGrpcServiceImplBase {

    private final MemberService memberService;

    public MemberGrpcServiceImpl(MemberService memberService) {
        this.memberService = memberService;
    }

    @Override
    public void getMemberById(GetMemberByIdRequest request, StreamObserver<MemberResponse> responseObserver) {

        var member = memberService.getMemberById(request.getMemberId());

        MemberResponse response = MemberResponse.newBuilder()
                .setId(member.getId())
                .setFirstName(member.getFirstName())
                .setLastName(member.getLastName())
                .setEmail(member.getEmail())
                .setContact(member.getContact())
                .setMemberNumber(member.getMemberNumber())
                .setStatus(member.isStatus())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getMemberByEmail(GetMemberByEmailRequest request, StreamObserver<MemberResponse> responseObserver) {

        var member = memberService.getMemberByEmail(request.getEmail());

        MemberResponse response = MemberResponse.newBuilder()
                .setId(member.getId())
                .setFirstName(member.getFirstName())
                .setLastName(member.getLastName())
                .setEmail(member.getEmail())
                .setContact(member.getContact())
                .setMemberNumber(member.getMemberNumber())
                .setStatus(member.isStatus())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
