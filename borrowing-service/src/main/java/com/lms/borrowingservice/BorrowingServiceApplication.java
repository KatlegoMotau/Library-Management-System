package com.lms.borrowingservice;

import com.lms.memberservice.grpc.MemberGrpcServiceGrpc;
import com.lms.bookservice.grpc.BookGrpcServiceGrpc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.grpc.client.ImportGrpcClients;

@SpringBootApplication
@ImportGrpcClients(target = "member", types = MemberGrpcServiceGrpc.MemberGrpcServiceBlockingStub.class)
@ImportGrpcClients(target = "book", types = BookGrpcServiceGrpc.BookGrpcServiceBlockingStub.class)
public class BorrowingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BorrowingServiceApplication.class, args);
    }
}