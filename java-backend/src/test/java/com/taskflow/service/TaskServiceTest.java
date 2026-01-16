package com.taskflow.service;

import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.request.TaskStatusRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.*;
import com.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private UserService userService;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Project testProject;
    private Task testTask;

    @BeforeEach
    void setUp() {
        // Przygotowanie danych testowych
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("Jan")
                .lastName("Kowalski")
                .password("hashedPassword")
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .build();

        testProject = Project.builder()
                .id(1L)
                .name("Test Project")
                .description("Opis projektu testowego")
                .owner(testUser)
                .createdAt(LocalDateTime.now())
                .build();

        testTask = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Opis zadania testowego")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .project(testProject)
                .assignee(testUser)
                .dueDate(LocalDate.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Powinno zwrócić zadanie po ID")
    void shouldReturnTaskById() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        // When
        TaskResponse result = taskService.getTaskById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Task");
        assertThat(result.getStatus()).isEqualTo(TaskStatus.TODO);
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Powinno rzucić wyjątek gdy zadanie nie istnieje")
    void shouldThrowExceptionWhenTaskNotFound() {
        // Given
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> taskService.getTaskById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Zadanie");
    }

    @Test
    @DisplayName("Powinno utworzyć nowe zadanie")
    void shouldCreateNewTask() {
        // Given
        TaskRequest request = new TaskRequest();
        request.setTitle("Nowe zadanie");
        request.setDescription("Opis nowego zadania");
        request.setProjectId(1L);
        request.setAssigneeId(1L);
        request.setPriority(TaskPriority.HIGH);
        request.setDueDate(LocalDate.now().plusDays(14));

        when(projectService.getProjectEntityById(1L)).thenReturn(testProject);
        when(userService.getUserEntityById(1L)).thenReturn(testUser);
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task saved = invocation.getArgument(0);
            saved.setId(2L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });

        // When
        TaskResponse result = taskService.createTask(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Nowe zadanie");
        assertThat(result.getPriority()).isEqualTo(TaskPriority.HIGH);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Powinno zaktualizować status zadania")
    void shouldUpdateTaskStatus() {
        // Given
        TaskStatusRequest request = new TaskStatusRequest(TaskStatus.IN_PROGRESS);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        TaskResponse result = taskService.updateTaskStatus(1L, request);

        // Then
        assertThat(result).isNotNull();
        assertThat(testTask.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        verify(taskRepository, times(1)).save(testTask);
    }

    @Test
    @DisplayName("Powinno zwrócić listę zadań projektu")
    void shouldReturnTasksByProject() {
        // Given
        Task task2 = Task.builder()
                .id(2L)
                .title("Drugie zadanie")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.LOW)
                .project(testProject)
                .createdAt(LocalDateTime.now())
                .build();

        List<Task> tasks = Arrays.asList(testTask, task2);
        when(taskRepository.findByProjectId(1L)).thenReturn(tasks);

        // When
        List<TaskResponse> result = taskService.getTasksByProject(1L);

        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Task");
        assertThat(result.get(1).getTitle()).isEqualTo("Drugie zadanie");
    }

    @Test
    @DisplayName("Powinno usunąć zadanie")
    void shouldDeleteTask() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        doNothing().when(taskRepository).delete(testTask);

        // When
        taskService.deleteTask(1L);

        // Then
        verify(taskRepository, times(1)).delete(testTask);
    }
}
