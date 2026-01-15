package com.taskflow.repository;

import com.taskflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repozytorium dla encji User.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Znajduje użytkownika po adresie email.
     * @param email Adres email
     * @return Optional z użytkownikiem
     */
    Optional<User> findByEmail(String email);

    /**
     * Sprawdza czy użytkownik o podanym emailu istnieje.
     * @param email Adres email
     * @return true jeśli istnieje
     */
    boolean existsByEmail(String email);
}
