package com.taskflow.service;

import com.taskflow.dto.request.LoginRequest;
import com.taskflow.dto.request.RegisterRequest;
import com.taskflow.dto.response.AuthResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.BadRequestException;
import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("Jan")
                .lastName("Kowalski")
                .password("$2a$10$hashedPassword")
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Powinno zarejestrować nowego użytkownika")
    void shouldRegisterNewUser() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("SecurePass123!");
        request.setFirstName("Anna");
        request.setLastName("Nowak");

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("SecurePass123!")).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(2L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwt.token.here");
        when(jwtTokenProvider.getExpirationTime()).thenReturn(86400L);

        // When
        AuthResponse result = authService.register(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getAccessToken()).isEqualTo("jwt.token.here");
        assertThat(result.getTokenType()).isEqualTo("Bearer");
        assertThat(result.getUser()).isNotNull();
        assertThat(result.getUser().getEmail()).isEqualTo("newuser@example.com");
        assertThat(result.getUser().getFirstName()).isEqualTo("Anna");
        assertThat(result.getUser().getLastName()).isEqualTo("Nowak");
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtTokenProvider, times(1)).generateToken("newuser@example.com");
    }

    @Test
    @DisplayName("Powinno rzucić wyjątek gdy email już istnieje")
    void shouldThrowExceptionWhenEmailExists() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("SecurePass123!");
        request.setFirstName("Test");
        request.setLastName("User");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("email już istnieje");
    }

    @Test
    @DisplayName("Powinno zalogować użytkownika i zwrócić token")
    void shouldLoginUserAndReturnToken() {
        // Given
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("jwt.token.here");
        when(jwtTokenProvider.getExpirationTime()).thenReturn(86400L);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        AuthResponse result = authService.login(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getAccessToken()).isEqualTo("jwt.token.here");
        assertThat(result.getTokenType()).isEqualTo("Bearer");
        assertThat(result.getUser().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Powinno rzucić wyjątek przy nieprawidłowych danych logowania")
    void shouldThrowExceptionOnInvalidCredentials() {
        // Given
        LoginRequest request = new LoginRequest("test@example.com", "wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }
}
