"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Task, User } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  projectId: number
  users: User[]
  onSave: (data: {
    title: string
    description?: string
    projectId: number
    assigneeId?: number
    priority?: string
    dueDate?: string
  }) => Promise<void>
}

export function TaskDialog({ open, onOpenChange, task, projectId, users, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [assigneeId, setAssigneeId] = useState<string>("0") // Updated default value to '0'
  const [dueDate, setDueDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority)
      setAssigneeId(task.assignee?.id?.toString() || "0") // Updated default value to '0'
      setDueDate(task.dueDate || "")
    } else {
      setTitle("")
      setDescription("")
      setPriority("MEDIUM")
      setAssigneeId("0") // Updated default value to '0'
      setDueDate("")
    }
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSave({
        title,
        description: description || undefined,
        projectId,
        assigneeId: assigneeId ? Number.parseInt(assigneeId) : undefined,
        priority,
        dueDate: dueDate || undefined,
      })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edytuj zadanie" : "Nowe zadanie"}</DialogTitle>
          <DialogDescription>
            {task ? "Zaktualizuj szczegóły zadania" : "Dodaj nowe zadanie do projektu"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tytuł</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="np. Implementacja logowania"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Opis</Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Szczegółowy opis zadania..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priorytet</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Wybierz priorytet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Niski</SelectItem>
                    <SelectItem value="MEDIUM">Średni</SelectItem>
                    <SelectItem value="HIGH">Wysoki</SelectItem>
                    <SelectItem value="URGENT">Pilny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Przypisz do</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Wybierz osobę" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Nieprzypisane</SelectItem> {/* Updated value prop to '0' */}
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Termin</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {task ? "Zapisz" : "Utwórz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
