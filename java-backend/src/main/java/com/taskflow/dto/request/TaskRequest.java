package com.taskflow.dto.request;

import com.taskflow.model.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO dla żądania tworzenia/aktualizacji zadania.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Tytuł zadania jest wymagany")
    @Size(max = 200, message = "Tytuł zadania może mieć maksymalnie 200 znaków")
    private String title;

    private String description;

    @NotNull(message = "ID projektu jest wymagane")
    private Long projectId;

    private Long assigneeId;

    private TaskPriority priority = TaskPriority.MEDIUM;

    private LocalDate dueDate;
}
