"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FolderKanban, CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react"

interface Project {
  id: string
  name: string
  taskCount: number
  completedTaskCount: number
}

interface Task {
  id: string
  title: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  project: { id: string; name: string }
  overdue?: boolean
}

interface DashboardViewProps {
  projects: Project[]
  tasks: Task[]
}

export function DashboardView({ projects, tasks }: DashboardViewProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "DONE").length
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length
  const overdueTasks = tasks.filter((t) => t.overdue).length

  const stats = [
    {
      title: "Wszystkie projekty",
      value: projects.length,
      icon: FolderKanban,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Ukończone zadania",
      value: completedTasks,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "W trakcie",
      value: inProgressTasks,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Przeterminowane",
      value: overdueTasks,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Przegląd Twoich projektów i zadań</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Postęp projektów
            </CardTitle>
            <CardDescription>Status realizacji zadań w projektach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Brak projektów do wyświetlenia</p>
            ) : (
              projects.slice(0, 5).map((project) => {
                const progress =
                  project.taskCount > 0 ? Math.round((project.completedTaskCount / project.taskCount) * 100) : 0
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {project.completedTaskCount}/{project.taskCount}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Ostatnie zadania
            </CardTitle>
            <CardDescription>Twoje najnowsze aktywności</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Brak zadań do wyświetlenia</p>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.project.name}</p>
                    </div>
                    <Badge
                      variant={
                        task.status === "DONE" ? "default" : task.status === "IN_PROGRESS" ? "secondary" : "outline"
                      }
                    >
                      {task.status === "TODO" && "Do zrobienia"}
                      {task.status === "IN_PROGRESS" && "W trakcie"}
                      {task.status === "DONE" && "Ukończone"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
