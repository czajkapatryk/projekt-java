package com.taskflow.service;

import com.taskflow.dto.request.ProjectRequest;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Serwis do zarządzania projektami.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    /**
     * Pobiera projekty użytkownika.
     * @param userId ID użytkownika
     * @param pageable Parametry stronicowania
     * @return Strona projektów
     */
    public Page<ProjectResponse> getProjectsByUser(Long userId, Pageable pageable) {
        return projectRepository.findAllByUserId(userId, pageable)
                .map(ProjectResponse::fromEntity);
    }

    /**
     * Pobiera projekt po ID.
     * @param id ID projektu
     * @return Dane projektu
     */
    public ProjectResponse getProjectById(Long id) {
        Project project = findProjectById(id);
        return ProjectResponse.fromEntity(project);
    }

    /**
     * Tworzy nowy projekt.
     * @param request Dane projektu
     * @param ownerId ID właściciela
     * @return Utworzony projekt
     */
    @Transactional
    public ProjectResponse createProject(ProjectRequest request, Long ownerId) {
        User owner = userService.getUserEntityById(ownerId);

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        Project savedProject = projectRepository.save(project);
        return ProjectResponse.fromEntity(savedProject);
    }

    /**
     * Aktualizuje projekt.
     * @param id ID projektu
     * @param request Nowe dane projektu
     * @param userId ID użytkownika wykonującego operację
     * @return Zaktualizowany projekt
     */
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, Long userId) {
        Project project = findProjectById(id);
        checkOwnership(project, userId);

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return ProjectResponse.fromEntity(updatedProject);
    }

    /**
     * Usuwa projekt.
     * @param id ID projektu
     * @param userId ID użytkownika wykonującego operację
     */
    @Transactional
    public void deleteProject(Long id, Long userId) {
        Project project = findProjectById(id);
        checkOwnership(project, userId);
        projectRepository.delete(project);
    }

    /**
     * Pobiera encję projektu po ID (do użytku wewnętrznego).
     * @param id ID projektu
     * @return Encja projektu
     */
    public Project getProjectEntityById(Long id) {
        return findProjectById(id);
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projekt", "id", id));
    }

    private void checkOwnership(Project project, Long userId) {
        if (!project.getOwner().getId().equals(userId)) {
            throw new UnauthorizedException("Nie masz uprawnień do tego projektu");
        }
    }

    /**
     * Pobiera liczbę projektów użytkownika.
     * @param userId ID użytkownika
     * @return Liczba projektów
     */
    public long getProjectsCountByUser(Long userId) {
        return projectRepository.countByOwnerId(userId);
    }
}
