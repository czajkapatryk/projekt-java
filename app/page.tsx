"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { api, type Project, type Task } from "@/lib/api"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Sidebar } from "@/components/sidebar"
import { DashboardView } from "@/components/dashboard-view"
import { ProjectsView } from "@/components/projects-view"
import { ProjectView } from "@/components/project-view"
import { ProjectDialog } from "@/components/project-dialog"
import { TaskDialog } from "@/components/task-dialog"
import { DeleteDialog } from "@/components/delete-dialog"
import { Loader2 } from "lucide-react"

interface ProjectWithStats extends Project {
  taskCount: number
  completedTaskCount: number
}

interface TaskWithProject extends Task {
  project: { id: string; name: string }
  assignee?: { id: string; firstName: string; lastName: string } | null
  overdue?: boolean
}

function AppContent() {
  const { user, token, isLoading: authLoading } = useAuth()
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [activeView, setActiveView] = useState("dashboard")
  const [projects, setProjects] = useState<ProjectWithStats[]>([])
  const [allTasks, setAllTasks] = useState<TaskWithProject[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null)
  const [projectTasks, setProjectTasks] = useState<TaskWithProject[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectWithStats | null>(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithProject | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<{
    type: "project" | "task"
    item: ProjectWithStats | TaskWithProject
  } | null>(null)

  // Fetch data when authenticated
  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  // Fetch project tasks when project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchProjectTasks(selectedProject.id)
    }
  }, [selectedProject])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.getProjects(),
        api.getUsers(),
      ])
      setUsers(usersRes)

      // Fetch tasks for each project to calculate stats
      const projectsWithStats: ProjectWithStats[] = await Promise.all(
        projectsRes.map(async (project) => {
          const tasks = await api.getTasksByProject(project.id)
          const taskCount = tasks.length
          const completedTaskCount = tasks.filter((t) => t.status === "DONE").length
          return {
            ...project,
            taskCount,
            completedTaskCount,
          }
        }),
      )

      setProjects(projectsWithStats)

      // Collect all tasks with project info
      const allTasksWithProjects: TaskWithProject[] = []
      for (const project of projectsRes) {
        const tasks = await api.getTasksByProject(project.id)
        tasks.forEach((task) => {
          allTasksWithProjects.push({
            ...task,
            project: { id: project.id, name: project.name },
            assignee: task.assignee_name
              ? {
                  id: task.assignee_id || "",
                  firstName: task.assignee_name.split(" ")[0],
                  lastName: task.assignee_name.split(" ")[1] || "",
                }
              : null,
            overdue: task.due_date ? new Date(task.due_date) < new Date() && task.status !== "DONE" : false,
          })
        })
      }
      setAllTasks(allTasksWithProjects)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjectTasks = async (projectId: string) => {
    try {
      const tasks = await api.getTasksByProject(projectId)
      const project = projects.find((p) => p.id === projectId)
      const tasksWithProject: TaskWithProject[] = tasks.map((task) => ({
        ...task,
        project: { id: projectId, name: project?.name || "" },
        assignee: task.assignee_name
          ? {
              id: task.assignee_id || "",
              firstName: task.assignee_name.split(" ")[0],
              lastName: task.assignee_name.split(" ")[1] || "",
            }
          : null,
        overdue: task.due_date ? new Date(task.due_date) < new Date() && task.status !== "DONE" : false,
      }))
      setProjectTasks(tasksWithProject)
    } catch (error) {
      console.error("Error fetching project tasks:", error)
    }
  }

  const handleCreateProject = () => {
    setEditingProject(null)
    setProjectDialogOpen(true)
  }

  const handleEditProject = (project: ProjectWithStats) => {
    setEditingProject(project)
    setProjectDialogOpen(true)
  }

  const handleDeleteProject = (project: ProjectWithStats) => {
    setDeletingItem({ type: "project", item: project })
    setDeleteDialogOpen(true)
  }

  const handleSaveProject = async (data: { name: string; description: string }) => {
    if (editingProject) {
      await api.updateProject(editingProject.id, data)
    } else {
      await api.createProject(data)
    }
    fetchData()
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setTaskDialogOpen(true)
  }

  const handleEditTask = (task: TaskWithProject) => {
    setEditingTask(task)
    setTaskDialogOpen(true)
  }

  const handleDeleteTask = (task: TaskWithProject) => {
    setDeletingItem({ type: "task", item: task })
    setDeleteDialogOpen(true)
  }

  const handleSaveTask = async (data: {
    title: string
    description?: string
    priority?: string
    dueDate?: string
  }) => {
    const projectId = selectedProject?.id || editingTask?.project.id
    if (!projectId) return

    if (editingTask) {
      await api.updateTask(editingTask.id, data)
    } else {
      await api.createTask(projectId, data)
    }
    fetchData()
    if (selectedProject) {
      fetchProjectTasks(selectedProject.id)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    await api.updateTask(taskId, { status })
    fetchData()
    if (selectedProject) {
      fetchProjectTasks(selectedProject.id)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingItem) return
    if (deletingItem.type === "project") {
      await api.deleteProject((deletingItem.item as ProjectWithStats).id)
      if (selectedProject?.id === (deletingItem.item as ProjectWithStats).id) {
        setSelectedProject(null)
        setActiveView("projects")
      }
    } else {
      await api.deleteTask((deletingItem.item as TaskWithProject).id)
    }
    fetchData()
    if (selectedProject) {
      fetchProjectTasks(selectedProject.id)
    }
    setDeletingItem(null)
  }

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative z-10">
          {authMode === "login" ? (
            <LoginForm onSwitchToRegister={() => setAuthMode("register")} onSuccess={() => fetchData()} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view)
          setSelectedProject(null)
        }}
        onCreateProject={handleCreateProject}
      />

      <main className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedProject ? (
          <ProjectView
            project={selectedProject as any}
            tasks={projectTasks as any}
            users={users}
            onBack={() => setSelectedProject(null)}
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask as any}
            onDeleteTask={handleDeleteTask as any}
            onUpdateTaskStatus={handleUpdateTaskStatus as any}
          />
        ) : activeView === "dashboard" ? (
          <DashboardView projects={projects as any} tasks={allTasks as any} />
        ) : activeView === "projects" ? (
          <ProjectsView
            projects={projects as any}
            onCreateProject={handleCreateProject}
            onSelectProject={(project) => setSelectedProject(project as any)}
            onEditProject={handleEditProject as any}
            onDeleteProject={handleDeleteProject as any}
          />
        ) : null}
      </main>

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        project={editingProject as any}
        onSave={handleSaveProject}
      />

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask as any}
        projectId={selectedProject?.id || editingTask?.project.id || ""}
        users={users}
        onSave={handleSaveTask as any}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={deletingItem?.type === "project" ? "Usuń projekt" : "Usuń zadanie"}
        description={
          deletingItem?.type === "project"
            ? `Czy na pewno chcesz usunąć projekt "${(deletingItem?.item as ProjectWithStats)?.name}"? Ta operacja jest nieodwracalna i usunie wszystkie zadania w projekcie.`
            : `Czy na pewno chcesz usunąć zadanie "${(deletingItem?.item as TaskWithProject)?.title}"? Ta operacja jest nieodwracalna.`
        }
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
