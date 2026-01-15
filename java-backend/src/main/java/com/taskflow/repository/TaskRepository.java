package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repozytorium dla encji Task.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Znajduje zadania w projekcie.
     * @param projectId ID projektu
     * @return Lista zadań
     */
    List<Task> findByProjectId(Long projectId);

    /**
     * Znajduje zadania przypisane do użytkownika.
     * @param assigneeId ID użytkownika
     * @return Lista zadań
     */
    List<Task> findByAssigneeId(Long assigneeId);

    /**
     * Znajduje zadania z filtrami.
     * @param projectId ID projektu (opcjonalne)
     * @param status Status (opcjonalny)
     * @param priority Priorytet (opcjonalny)
     * @param assigneeId ID przypisanego użytkownika (opcjonalne)
     * @param pageable Parametry stronicowania
     * @return Strona zadań
     */
    @Query("SELECT t FROM Task t WHERE " +
           "(:projectId IS NULL OR t.project.id = :projectId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:assigneeId IS NULL OR t.assignee.id = :assigneeId)")
    Page<Task> findWithFilters(
            @Param("projectId") Long projectId,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority,
            @Param("assigneeId") Long assigneeId,
            Pageable pageable);

    /**
     * Zlicza zadania w projekcie według statusu.
     * @param projectId ID projektu
     * @param status Status
     * @return Liczba zadań
     */
    long countByProjectIdAndStatus(Long projectId, TaskStatus status);
}
