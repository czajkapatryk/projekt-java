package com.taskflow.dto.request;

import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dla żądania zmiany statusu zadania.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusRequest {

    @NotNull(message = "Status jest wymagany")
    private TaskStatus status;
}
