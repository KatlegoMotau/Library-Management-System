package com.lms.borrowingservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ADMIN can view all borrowing records
                        .requestMatchers(HttpMethod.GET, "/api/borrowings")
                        .hasRole("ADMIN")

                        // ADMIN can update overdue borrowing records
                        .requestMatchers(HttpMethod.PUT, "/api/borrowings/overdue")
                        .hasRole("ADMIN")

                        // ADMIN and MEMBER can borrow books
                        .requestMatchers(HttpMethod.POST, "/api/borrowings/borrow")
                        .hasAnyRole("ADMIN", "MEMBER")

                        // ADMIN and MEMBER can return books
                        .requestMatchers(HttpMethod.PUT, "/api/borrowings/return/**")
                        .hasAnyRole("ADMIN", "MEMBER")

                        // ADMIN and MEMBER can access individual records
                        // Ownership is checked in BorrowingController
                        .requestMatchers(HttpMethod.GET, "/api/borrowings/**")
                        .hasAnyRole("ADMIN", "MEMBER")

                        // Everything else requires authentication
                        .anyRequest().authenticated())

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName("role");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

        return converter;
    }
}
