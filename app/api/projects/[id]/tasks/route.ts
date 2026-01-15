import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET tasks for project
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const tasks = await sql`
      SELECT t.*, 
             u.first_name || ' ' || u.last_name as assignee_name
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.project_id = ${id}
      ORDER BY t.created_at DESC
    `

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}

// POST create task
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description, status, priority, assigneeId, dueDate } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Tytuł zadania jest wymagany" }, { status: 400 })
    }

    const tasks = await sql`
      INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date)
      VALUES (
        ${title}, 
        ${description || null}, 
        ${status || "TODO"}, 
        ${priority || "MEDIUM"}, 
        ${id}, 
        ${assigneeId || null}, 
        ${dueDate || null}
      )
      RETURNING *
    `

    return NextResponse.json(tasks[0], { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}
