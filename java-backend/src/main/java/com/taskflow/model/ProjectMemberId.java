package com.taskflow.model;

import lombok.*;

import java.io.Serializable;

/**
 * Klasa reprezentująca złożony klucz główny dla ProjectMember.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberId implements Serializable {
    private Long project;
    private Long user;
}
