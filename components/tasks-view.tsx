"use client"

import type { Task } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, Calendar, FolderKanban, MoreVertical, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TasksViewProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

const statusColors = {
  TODO: "bg-slate-500",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-amber-500",
  DONE: "bg-green-500",
}

const statusLabels = {
  TODO: "Do zrobienia",
  IN_PROGRESS: "W trakcie",
  IN_REVIEW: "Review",
  DONE: "Ukończone",
}

const priorityColors = {
  LOW: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  MEDIUM: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  HIGH: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  URGENT: "bg-red-500/20 text-red-400 border-red-500/30",
}

const priorityLabels = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
  URGENT: "Pilny",
}

export function TasksView({ tasks, onEditTask, onDeleteTask }: TasksViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Moje zadania</h1>
        <p className="text-muted-foreground">Wszystkie zadania przypisane do Ciebie</p>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Brak zadań</h3>
            <p className="mt-2 text-center text-muted-foreground">Nie masz jeszcze przypisanych żadnych zadań</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="border-border/50 bg-card/50 transition-all hover:border-primary/30">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={cn("h-10 w-1 rounded-full", statusColors[task.status])} />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge variant="outline" className={priorityColors[task.priority]}>
                      {priorityLabels[task.priority]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FolderKanban className="h-3 w-3" />
                      {task.project.name}
                    </span>
                    {task.dueDate && (
                      <span className={cn("flex items-center gap-1", task.overdue && "text-red-400")}>
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString("pl-PL")}
                      </span>
                    )}
                    <Badge variant="secondary">{statusLabels[task.status]}</Badge>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTask(task)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edytuj
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteTask(task)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
