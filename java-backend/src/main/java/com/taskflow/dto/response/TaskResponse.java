package com.taskflow.dto.response;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO dla odpowiedzi zawierającej dane zadania.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private boolean overdue;
    private ProjectSummary project;
    private UserResponse assignee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Uproszczone dane projektu dla odpowiedzi zadania.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectSummary {
        private Long id;
        private String name;
    }

    /**
     * Tworzy TaskResponse z encji Task.
     * @param task Encja zadania
     * @return TaskResponse
     */
    public static TaskResponse fromEntity(Task task) {
        TaskResponseBuilder builder = TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .overdue(task.isOverdue())
                .project(ProjectSummary.builder()
                        .id(task.getProject().getId())
                        .name(task.getProject().getName())
                        .build())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt());

        if (task.getAssignee() != null) {
            builder.assignee(UserResponse.fromEntity(task.getAssignee()));
        }

        return builder.build();
    }
}
