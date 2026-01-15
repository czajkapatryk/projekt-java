import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET single task
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const tasks = await sql`
      SELECT t.*, u.first_name || ' ' || u.last_name as assignee_name
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.id = ${id}
    `

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Zadanie nie znalezione" }, { status: 404 })
    }

    return NextResponse.json(tasks[0])
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}

// PUT update task
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description, status, priority, assigneeId, dueDate } = await request.json()

    const tasks = await sql`
      UPDATE tasks 
      SET 
        title = COALESCE(${title}, title),
        description = ${description},
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        assignee_id = ${assigneeId || null},
        due_date = ${dueDate || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Zadanie nie znalezione" }, { status: 404 })
    }

    return NextResponse.json(tasks[0])
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}

// DELETE task
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const result = await sql`
      DELETE FROM tasks WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Zadanie nie znalezione" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}
