package com.lms.borrowingservice.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;

@Component
public class StompJwtChannelInterceptor implements ChannelInterceptor {

    private static final String ADMIN_DESTINATION = "/topic/admin/activity";

    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    public StompJwtChannelInterceptor(JwtDecoder jwtDecoder, JwtAuthenticationConverter jwtAuthenticationConverter) {
        this.jwtDecoder = jwtDecoder;
        this.jwtAuthenticationConverter = jwtAuthenticationConverter;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if(accessor == null)
        {
            return message;
        }

        StompCommand command = accessor.getCommand();

        if(command == null)
        {
            return message;
        }

        // Authenticate the WebSocket connection.
        if(command == StompCommand.CONNECT)
        {

            String authorization = accessor.getFirstNativeHeader("Authorization");

            if(authorization == null || !authorization.startsWith("Bearer "))
            {
                throw new AccessDeniedException("Missing WebSocket authentication token.");
            }

            String token = authorization.substring(7).trim();

            // Validate the JWT signature and expiration.
            Jwt jwt = jwtDecoder.decode(token);

            // Reuse the existing application's JWT authority converter.
            Authentication authentication = jwtAuthenticationConverter.convert(jwt);

            if(authentication == null || !authentication.isAuthenticated())
            {
                throw new AccessDeniedException("Invalid authentication.");
            }

            accessor.setUser(authentication);

            return message;
        }

        // Only authenticated administrators can subscribe to this topic.
        if(command == StompCommand.SUBSCRIBE)
        {

            String destination = accessor.getDestination();

            Authentication authentication = (Authentication) accessor.getUser();

            if(authentication == null || !authentication.isAuthenticated())
            {
                throw new AccessDeniedException("Authentication required.");
            }

            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(authority ->
                            authority.getAuthority().equals("ROLE_ADMIN"));

            if(!isAdmin)
            {
                throw new AccessDeniedException("Administrator access required.");
            }

            if(!ADMIN_DESTINATION.equals(destination))
            {
                throw new AccessDeniedException("Subscription destination not permitted.");
            }

            return message;
        }

        // Allow clients to unsubscribe and disconnect.
        if(command == StompCommand.UNSUBSCRIBE || command == StompCommand.DISCONNECT)
        {
            return message;
        }

        // Clients cannot publish messages to the server.
        throw new AccessDeniedException("STOMP command not permitted.");
    }
}
