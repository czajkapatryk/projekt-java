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

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssigneeId(Long assigneeId);

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

    long countByProjectIdAndStatus(Long projectId, TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.owner.id = :ownerId")
    long countByProjectOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.owner.id = :ownerId AND t.status = :status")
    long countByProjectOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") TaskStatus status);
}
