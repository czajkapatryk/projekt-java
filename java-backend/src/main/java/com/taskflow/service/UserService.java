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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik", "id", id));
        return UserResponse.fromEntity(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik", "email", email));
        return UserResponse.fromEntity(user);
    }

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik", "id", id));
    }
}
