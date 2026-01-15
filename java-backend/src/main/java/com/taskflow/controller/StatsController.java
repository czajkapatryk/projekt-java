package com.taskflow.controller;

import com.taskflow.service.ProjectService;
import com.taskflow.service.TaskService;
import com.taskflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
public class StatsController {

    private final ProjectService projectService;
    private final TaskService taskService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserByEmail(userDetails.getUsername()).getId();
        
        long projectsCount = projectService.getProjectsCountByUser(userId);
        long totalTasks = taskService.getTotalTasksCountByUser(userId);
        long todoTasks = taskService.getTasksCountByStatusAndUser(userId, com.taskflow.model.TaskStatus.TODO);
        long inProgressTasks = taskService.getTasksCountByStatusAndUser(userId, com.taskflow.model.TaskStatus.IN_PROGRESS);
        long doneTasks = taskService.getTasksCountByStatusAndUser(userId, com.taskflow.model.TaskStatus.DONE);
        
        return ResponseEntity.ok(Map.of(
                "projects", projectsCount,
                "totalTasks", totalTasks,
                "todoTasks", todoTasks,
                "inProgressTasks", inProgressTasks,
                "doneTasks", doneTasks
        ));
    }
}
