import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const userId = Buffer.from(token, "base64").toString().split(":")[0]

    const projects = await sql`
      SELECT p.*, u.first_name || ' ' || u.last_name as owner_name,
             (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      WHERE p.owner_id = ${userId}
         OR p.id IN (SELECT project_id FROM project_members WHERE user_id = ${userId})
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}

// POST create project
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const userId = Buffer.from(token, "base64").toString().split(":")[0]

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Nazwa projektu jest wymagana" }, { status: 400 })
    }

    const projects = await sql`
      INSERT INTO projects (name, description, owner_id)
      VALUES (${name}, ${description || null}, ${userId})
      RETURNING *
    `

    return NextResponse.json(projects[0], { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}
