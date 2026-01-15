package com.taskflow.repository;

import com.taskflow.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repozytorium dla encji Project.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /**
     * Znajduje wszystkie projekty użytkownika (jako właściciel lub członek).
     * @param userId ID użytkownika
     * @param pageable Parametry stronicowania
     * @return Strona projektów
     */
    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN p.members m " +
           "WHERE p.owner.id = :userId OR m.user.id = :userId")
    Page<Project> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * Znajduje projekty należące do użytkownika.
     * @param ownerId ID właściciela
     * @return Lista projektów
     */
    List<Project> findByOwnerId(Long ownerId);
}
