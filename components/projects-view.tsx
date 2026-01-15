"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, Plus, MoreVertical, Trash2, Edit, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Project {
  id: string
  name: string
  description: string | null
  taskCount: number
  completedTaskCount: number
  created_at: string
}

interface ProjectsViewProps {
  projects: Project[]
  onCreateProject: () => void
  onSelectProject: (project: Project) => void
  onEditProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export function ProjectsView({
  projects,
  onCreateProject,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}: ProjectsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projekty</h1>
          <p className="text-muted-foreground">Zarządzaj swoimi projektami</p>
        </div>
        <Button onClick={onCreateProject} className="gap-2">
          <Plus className="h-4 w-4" />
          Nowy projekt
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4">
              <FolderKanban className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Brak projektów</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Utwórz swój pierwszy projekt, aby rozpocząć zarządzanie zadaniami
            </p>
            <Button onClick={onCreateProject} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Utwórz projekt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const progress =
              project.taskCount > 0 ? Math.round((project.completedTaskCount / project.taskCount) * 100) : 0

            return (
              <Card
                key={project.id}
                className="group cursor-pointer border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg"
                onClick={() => onSelectProject(project)}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description || "Brak opisu"}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectProject(project)
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Otwórz
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditProject(project)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edytuj
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteProject(project)
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Postęp</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {project.completedTaskCount} / {project.taskCount} zadań
                      </span>
                      <span>{new Date(project.created_at).toLocaleDateString("pl-PL")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
