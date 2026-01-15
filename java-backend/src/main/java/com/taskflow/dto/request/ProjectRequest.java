package com.taskflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dla żądania tworzenia/aktualizacji projektu.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Nazwa projektu jest wymagana")
    @Size(max = 100, message = "Nazwa projektu może mieć maksymalnie 100 znaków")
    private String name;

    private String description;
}
