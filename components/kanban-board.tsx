"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, Calendar, User, Edit, Trash2, ArrowRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  due_date: string | null
  assignee?: { id: string; firstName: string } | null
  overdue?: boolean
}

interface KanbanBoardProps {
  tasks: Task[]
  onCreateTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
  onUpdateStatus: (taskId: string, status: string) => void
}

const columns = [
  { id: "TODO", title: "Do zrobienia", color: "bg-slate-500" },
  { id: "IN_PROGRESS", title: "W trakcie", color: "bg-blue-500" },
  { id: "DONE", title: "Ukończone", color: "bg-green-500" },
]

const priorityColors = {
  LOW: "bg-slate-500/20 text-slate-400",
  MEDIUM: "bg-blue-500/20 text-blue-400",
  HIGH: "bg-amber-500/20 text-amber-400",
}

const priorityLabels = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
}

export function KanbanBoard({ tasks, onCreateTask, onEditTask, onDeleteTask, onUpdateStatus }: KanbanBoardProps) {
  const getNextStatus = (currentStatus: string): string | null => {
    const currentIndex = columns.findIndex((c) => c.id === currentStatus)
    if (currentIndex < columns.length - 1) {
      return columns[currentIndex + 1].id
    }
    return null
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id)

        return (
          <div key={column.id} className="w-80 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-full", column.color)} />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="ml-1">
                  {columnTasks.length}
                </Badge>
              </div>
              {column.id === "TODO" && (
                <Button variant="ghost" size="icon" onClick={onCreateTask}>
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className="border-border/50 bg-card/80 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <h4 className="font-medium leading-tight">{task.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditTask(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edytuj
                          </DropdownMenuItem>
                          {getNextStatus(task.status) && (
                            <DropdownMenuItem onClick={() => onUpdateStatus(task.id, getNextStatus(task.status)!)}>
                              <ArrowRight className="mr-2 h-4 w-4" />
                              Przenieś dalej
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteTask(task)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {task.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className={priorityColors[task.priority]}>
                        {priorityLabels[task.priority]}
                      </Badge>

                      {task.due_date && (
                        <div
                          className={cn(
                            "flex items-center gap-1 text-xs",
                            task.overdue ? "text-red-400" : "text-muted-foreground",
                          )}
                        >
                          <Calendar className="h-3 w-3" />
                          {new Date(task.due_date).toLocaleDateString("pl-PL")}
                        </div>
                      )}

                      {task.assignee && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {task.assignee.firstName}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {columnTasks.length === 0 && (
                <div className="rounded-lg border border-dashed border-border/50 p-4 text-center text-sm text-muted-foreground">
                  Brak zadań
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
