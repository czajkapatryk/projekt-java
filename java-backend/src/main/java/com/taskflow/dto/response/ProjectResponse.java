package com.taskflow.dto.response;

import com.taskflow.model.Project;
import com.taskflow.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO dla odpowiedzi zawierającej dane projektu.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private UserResponse owner;
    private Long taskCount;
    private Long completedTaskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Tworzy ProjectResponse z encji Project.
     * @param project Encja projektu
     * @return ProjectResponse
     */
    public static ProjectResponse fromEntity(Project project) {
        long totalTasks = project.getTasks().size();
        long completedTasks = project.getTasks().stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .owner(UserResponse.fromEntity(project.getOwner()))
                .taskCount(totalTasks)
                .completedTaskCount(completedTasks)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
