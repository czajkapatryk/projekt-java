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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;

    public Page<TaskResponse> getTasks(Long projectId, TaskStatus status,
                                        TaskPriority priority, Long assigneeId, 
                                        Pageable pageable) {
        return taskRepository.findWithFilters(projectId, status, priority, assigneeId, pageable)
                .map(TaskResponse::fromEntity);
    }

    public TaskResponse getTaskById(Long id) {
        Task task = findTaskById(id);
        return TaskResponse.fromEntity(task);
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByAssignee(Long userId) {
        return taskRepository.findByAssigneeId(userId).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

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

        if (request.getAssigneeId() != null && request.getAssigneeId() > 0) {
            User assignee = userService.getUserEntityById(request.getAssigneeId());
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskById(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : task.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null && request.getAssigneeId() > 0) {
            User assignee = userService.getUserEntityById(request.getAssigneeId());
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatusRequest request) {
        Task task = findTaskById(id);
        task.changeStatus(request.getStatus());
        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zadanie", "id", id));
    }

    public long getTotalTasksCountByUser(Long userId) {
        return taskRepository.countByProjectOwnerId(userId);
    }

    public long getTasksCountByStatusAndUser(Long userId, TaskStatus status) {
        return taskRepository.countByProjectOwnerIdAndStatus(userId, status);
    }
}
