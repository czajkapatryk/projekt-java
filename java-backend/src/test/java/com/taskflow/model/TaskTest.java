package com.taskflow.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class TaskTest {

    private Task task;
    private Project project;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("Jan")
                .lastName("Kowalski")
                .build();

        project = Project.builder()
                .id(1L)
                .name("Test Project")
                .owner(user)
                .build();

        task = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Opis zadania")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .project(project)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Zadanie bez terminu nie powinno być przeterminowane")
    void taskWithoutDueDateShouldNotBeOverdue() {
        // Given
        task.setDueDate(null);

        // When & Then
        assertThat(task.isOverdue()).isFalse();
    }

    @Test
    @DisplayName("Zadanie z przyszłym terminem nie powinno być przeterminowane")
    void taskWithFutureDueDateShouldNotBeOverdue() {
        // Given
        task.setDueDate(LocalDate.now().plusDays(7));

        // When & Then
        assertThat(task.isOverdue()).isFalse();
    }

    @Test
    @DisplayName("Zadanie z przeszłym terminem powinno być przeterminowane")
    void taskWithPastDueDateShouldBeOverdue() {
        // Given
        task.setDueDate(LocalDate.now().minusDays(1));
        task.setStatus(TaskStatus.TODO);

        // When & Then
        assertThat(task.isOverdue()).isTrue();
    }

    @Test
    @DisplayName("Ukończone zadanie nie powinno być przeterminowane nawet z przeszłym terminem")
    void completedTaskShouldNotBeOverdueEvenWithPastDueDate() {
        // Given
        task.setDueDate(LocalDate.now().minusDays(1));
        task.setStatus(TaskStatus.DONE);

        // When & Then
        assertThat(task.isOverdue()).isFalse();
    }

    @Test
    @DisplayName("Powinno zmienić status zadania")
    void shouldChangeTaskStatus() {
        // Given
        assertThat(task.getStatus()).isEqualTo(TaskStatus.TODO);

        // When
        task.changeStatus(TaskStatus.IN_PROGRESS);

        // Then
        assertThat(task.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
    }

    @Test
    @DisplayName("Powinno przejść przez wszystkie statusy")
    void shouldTransitionThroughAllStatuses() {
        // Given
        assertThat(task.getStatus()).isEqualTo(TaskStatus.TODO);

        // When & Then - TODO -> IN_PROGRESS
        task.changeStatus(TaskStatus.IN_PROGRESS);
        assertThat(task.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);

        // IN_PROGRESS -> IN_REVIEW
        task.changeStatus(TaskStatus.IN_REVIEW);
        assertThat(task.getStatus()).isEqualTo(TaskStatus.IN_REVIEW);

        // IN_REVIEW -> DONE
        task.changeStatus(TaskStatus.DONE);
        assertThat(task.getStatus()).isEqualTo(TaskStatus.DONE);
    }

    @Test
    @DisplayName("Domyślny priorytet powinien być MEDIUM")
    void defaultPriorityShouldBeMedium() {
        // Given
        Task newTask = Task.builder()
                .title("New Task")
                .project(project)
                .build();

        // When & Then
        assertThat(newTask.getPriority()).isEqualTo(TaskPriority.MEDIUM);
    }

    @Test
    @DisplayName("Domyślny status powinien być TODO")
    void defaultStatusShouldBeTodo() {
        // Given
        Task newTask = Task.builder()
                .title("New Task")
                .project(project)
                .build();

        // When & Then
        assertThat(newTask.getStatus()).isEqualTo(TaskStatus.TODO);
    }
}
