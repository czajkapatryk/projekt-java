package com.taskflow.service;

import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serwis do zarządzania użytkownikami.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    /**
     * Pobiera wszystkich użytkowników.
     * @return Lista użytkowników
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Pobiera użytkownika po ID.
     * @param id ID użytkownika
     * @return Dane użytkownika
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik", "id", id));
        return UserResponse.fromEntity(user);
    }

    /**
     * Pobiera użytkownika po email.
     * @param email Adres email
     * @return Dane użytkownika
     */
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik", "email", email));
        return UserResponse.fromEntity(user);
    }

    /**
     * Pobiera encję użytkownika po ID (do użytku wewnętrznego).
     * @param id ID użytkownika
     * @return Encja użytkownika
     */
    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik", "id", id));
    }
}
