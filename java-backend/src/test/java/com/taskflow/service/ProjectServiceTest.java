package com.taskflow.service;

import com.taskflow.dto.request.ProjectRequest;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private ProjectService projectService;

    private User testUser;
    private Project testProject;

    @BeforeEach
    void setUp() {
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
    }

    @Test
    @DisplayName("Powinno utworzyć nowy projekt")
    void shouldCreateNewProject() {
        // Given
        ProjectRequest request = new ProjectRequest("Nowy projekt", "Opis projektu");
        when(userService.getUserEntityById(1L)).thenReturn(testUser);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project saved = invocation.getArgument(0);
            saved.setId(2L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });

        // When
        ProjectResponse result = projectService.createProject(request, 1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Nowy projekt");
        assertThat(result.getOwner().getId()).isEqualTo(1L);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Powinno zwrócić projekt po ID")
    void shouldReturnProjectById() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        // When
        ProjectResponse result = projectService.getProjectById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Test Project");
    }

    @Test
    @DisplayName("Powinno rzucić wyjątek gdy projekt nie istnieje")
    void shouldThrowExceptionWhenProjectNotFound() {
        // Given
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> projectService.getProjectById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Projekt");
    }

    @Test
    @DisplayName("Powinno zaktualizować projekt")
    void shouldUpdateProject() {
        // Given
        ProjectRequest request = new ProjectRequest("Zaktualizowany projekt", "Nowy opis");
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        // When
        ProjectResponse result = projectService.updateProject(1L, request, 1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(testProject.getName()).isEqualTo("Zaktualizowany projekt");
        assertThat(testProject.getDescription()).isEqualTo("Nowy opis");
        verify(projectRepository, times(1)).save(testProject);
    }

    @Test
    @DisplayName("Powinno rzucić wyjątek przy próbie aktualizacji cudzego projektu")
    void shouldThrowExceptionWhenUpdatingOthersProject() {
        // Given
        ProjectRequest request = new ProjectRequest("Zaktualizowany", "Opis");
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        // When & Then
        assertThatThrownBy(() -> projectService.updateProject(1L, request, 999L))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("uprawnień");
    }

    @Test
    @DisplayName("Powinno usunąć projekt")
    void shouldDeleteProject() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        doNothing().when(projectRepository).delete(testProject);

        // When
        projectService.deleteProject(1L, 1L);

        // Then
        verify(projectRepository, times(1)).delete(testProject);
    }
}
