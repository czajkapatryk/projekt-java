"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  onCreateProject: () => void
}

export function Sidebar({ activeView, onViewChange, onCreateProject }: SidebarProps) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projekty", icon: FolderKanban },
    { id: "tasks", label: "Moje zadania", icon: CheckSquare },
  ]

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border/50 bg-card/30 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border/50 px-4">
        {!isCollapsed && <span className="text-lg font-bold text-primary">TaskFlow</span>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 space-y-1 p-2">
        {!isCollapsed && (
          <Button onClick={onCreateProject} className="mb-4 w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            Nowy projekt
          </Button>
        )}
        {isCollapsed && (
          <Button onClick={onCreateProject} size="icon" className="mb-4 w-full">
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-3", isCollapsed && "justify-center px-2")}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className="border-t border-border/50 p-2">
        {!isCollapsed && user && (
          <div className="mb-2 rounded-lg bg-secondary/50 p-3">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive",
            isCollapsed && "justify-center px-2",
          )}
          onClick={logout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Wyloguj się</span>}
        </Button>
      </div>
    </aside>
  )
}
