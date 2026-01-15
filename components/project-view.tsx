"use client"

import type { Project, Task, User } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { KanbanBoard } from "./kanban-board"
import { ArrowLeft, Plus } from "lucide-react"

interface ProjectViewProps {
  project: Project
  tasks: Task[]
  users: User[]
  onBack: () => void
  onCreateTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
  onUpdateTaskStatus: (taskId: number, status: string) => void
}

export function ProjectView({
  project,
  tasks,
  users,
  onBack,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
}: ProjectViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && <p className="text-muted-foreground">{project.description}</p>}
        </div>
        <Button onClick={onCreateTask} className="gap-2">
          <Plus className="h-4 w-4" />
          Nowe zadanie
        </Button>
      </div>

      <KanbanBoard
        tasks={tasks}
        onCreateTask={onCreateTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onUpdateStatus={onUpdateTaskStatus}
      />
    </div>
  )
}
