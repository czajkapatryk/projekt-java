package com.taskflow.service;

import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.request.TaskStatusRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.*;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serwis do zarządzania zadaniami.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;

    /**
     * Pobiera zadania z filtrami.
     * @param projectId ID projektu (opcjonalne)
     * @param status Status (opcjonalny)
     * @param priority Priorytet (opcjonalny)
     * @param assigneeId ID przypisanego użytkownika (opcjonalne)
     * @param pageable Parametry stronicowania
     * @return Strona zadań
     */
    public Page<TaskResponse> getTasks(Long projectId, TaskStatus status, 
                                        TaskPriority priority, Long assigneeId, 
                                        Pageable pageable) {
        return taskRepository.findWithFilters(projectId, status, priority, assigneeId, pageable)
                .map(TaskResponse::fromEntity);
    }

    /**
     * Pobiera zadanie po ID.
     * @param id ID zadania
     * @return Dane zadania
     */
    public TaskResponse getTaskById(Long id) {
        Task task = findTaskById(id);
        return TaskResponse.fromEntity(task);
    }

    /**
     * Pobiera zadania w projekcie.
     * @param projectId ID projektu
     * @return Lista zadań
     */
    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Pobiera zadania przypisane do użytkownika.
     * @param userId ID użytkownika
     * @return Lista zadań
     */
    public List<TaskResponse> getTasksByAssignee(Long userId) {
        return taskRepository.findByAssigneeId(userId).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Tworzy nowe zadanie.
     * @param request Dane zadania
     * @return Utworzone zadanie
     */
    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        Project project = projectService.getProjectEntityById(request.getProjectId());

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .project(project)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .build();

        if (request.getAssigneeId() != null) {
            User assignee = userService.getUserEntityById(request.getAssigneeId());
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    /**
     * Aktualizuje zadanie.
     * @param id ID zadania
     * @param request Nowe dane zadania
     * @return Zaktualizowane zadanie
     */
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskById(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : task.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userService.getUserEntityById(request.getAssigneeId());
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    /**
     * Aktualizuje status zadania.
     * @param id ID zadania
     * @param request Nowy status
     * @return Zaktualizowane zadanie
     */
    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatusRequest request) {
        Task task = findTaskById(id);
        task.changeStatus(request.getStatus());
        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    /**
     * Usuwa zadanie.
     * @param id ID zadania
     */
    @Transactional
    public void deleteTask(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zadanie", "id", id));
    }
}
