const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "USER" | "ADMIN"
}

export interface Project {
  id: string
  name: string
  description: string | null
  owner_id: string
  owner_name?: string
  task_count?: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  project_id: string
  assignee_id: string | null
  assignee_name?: string | null
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    const token = this.getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Błąd logowania")
    }
    return response.json()
  }

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AuthResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Błąd rejestracji")
    }
    return response.json()
  }

  async getProjects(): Promise<Project[]> {
    const response = await fetch("/api/projects", {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error("Błąd pobierania projektów")
    return response.json()
  }

  async getProject(id: string): Promise<Project> {
    const response = await fetch(`/api/projects/${id}`, {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error("Błąd pobierania projektu")
    return response.json()
  }

  async createProject(data: { name: string; description?: string }): Promise<Project> {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Błąd tworzenia projektu")
    return response.json()
  }

  async updateProject(id: string, data: { name: string; description?: string }): Promise<Project> {
    const response = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Błąd aktualizacji projektu")
    return response.json()
  }

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error("Błąd usuwania projektu")
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error("Błąd pobierania zadań")
    return response.json()
  }

  async createTask(
    projectId: string,
    data: {
      title: string
      description?: string
      priority?: string
      status?: string
      assigneeId?: string
      dueDate?: string
    },
  ): Promise<Task> {
    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Błąd tworzenia zadania")
    return response.json()
  }

  async updateTask(
    id: string,
    data: {
      title?: string
      description?: string
      status?: string
      priority?: string
      assigneeId?: string
      dueDate?: string
    },
  ): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Błąd aktualizacji zadania")
    return response.json()
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error("Błąd usuwania zadania")
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch("/api/users", {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error("Błąd pobierania użytkowników")
    return response.json()
  }

  async getStats(): Promise<{
    projects: number
    totalTasks: number
    todoTasks: number
    inProgressTasks: number
    doneTasks: number
  }> {
    const response = await fetch("/api/stats", {
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error("Błąd pobierania statystyk")
    return response.json()
  }
}

export const api = new ApiClient()
