package com.taskflow.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;


class UserTest {

    @Test
    @DisplayName("Powinno zwrócić pełne imię i nazwisko")
    void shouldReturnFullName() {
        // Given
        User user = User.builder()
                .id(1L)
                .email("jan.kowalski@example.com")
                .firstName("Jan")
                .lastName("Kowalski")
                .password("hashedPassword")
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .build();

        // When
        String fullName = user.getFullName();

        // Then
        assertThat(fullName).isEqualTo("Jan Kowalski");
    }

    @Test
    @DisplayName("Domyślna rola powinna być USER")
    void defaultRoleShouldBeUser() {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .password("password")
                .build();

        // When & Then
        assertThat(user.getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    @DisplayName("Powinno poprawnie ustawić rolę ADMIN")
    void shouldSetAdminRole() {
        // Given
        User user = User.builder()
                .email("admin@example.com")
                .firstName("Admin")
                .lastName("User")
                .password("password")
                .role(UserRole.ADMIN)
                .build();

        // When & Then
        assertThat(user.getRole()).isEqualTo(UserRole.ADMIN);
    }

    @Test
    @DisplayName("Pełne imię powinno działać z różnymi danymi")
    void fullNameShouldWorkWithVariousData() {
        // Given
        User user1 = User.builder()
                .firstName("Anna")
                .lastName("Nowak")
                .build();

        User user2 = User.builder()
                .firstName("Piotr")
                .lastName("Wiśniewski")
                .build();

        // When & Then
        assertThat(user1.getFullName()).isEqualTo("Anna Nowak");
        assertThat(user2.getFullName()).isEqualTo("Piotr Wiśniewski");
    }
}
