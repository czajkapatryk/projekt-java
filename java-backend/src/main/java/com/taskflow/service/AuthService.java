package com.taskflow.service;

import com.taskflow.dto.request.LoginRequest;
import com.taskflow.dto.request.RegisterRequest;
import com.taskflow.dto.response.AuthResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.BadRequestException;
import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Serwis do obsługi autentykacji i rejestracji.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    /**
     * Rejestruje nowego użytkownika i zwraca token autoryzacyjny.
     * @param request Dane rejestracji
     * @return Token i dane użytkownika
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Użytkownik o podanym adresie email już istnieje");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        User savedUser = userRepository.save(user);
        
        String token = jwtTokenProvider.generateToken(savedUser.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .user(UserResponse.fromEntity(savedUser))
                .build();
    }

    /**
     * Loguje użytkownika.
     * @param request Dane logowania
     * @return Token i dane użytkownika
     */
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String token = jwtTokenProvider.generateToken(authentication);
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadRequestException("Nieprawidłowe dane logowania"));

            return AuthResponse.builder()
                    .accessToken(token)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getExpirationTime())
                    .user(UserResponse.fromEntity(user))
                    .build();
        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for email: {}", request.getEmail());
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (user != null) {
                log.warn("User exists but password doesn't match. Password hash starts with: {}", 
                    user.getPassword() != null && user.getPassword().length() > 0 
                        ? user.getPassword().substring(0, Math.min(10, user.getPassword().length())) 
                        : "null");
            }
            throw e;
        }
    }
}
