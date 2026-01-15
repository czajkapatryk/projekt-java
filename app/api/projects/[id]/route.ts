import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET single project
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const projects = await sql`
      SELECT p.*, u.first_name || ' ' || u.last_name as owner_name
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = ${id}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Projekt nie znaleziony" }, { status: 404 })
    }

    return NextResponse.json(projects[0])
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}

// PUT update project
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, description } = await request.json()

    const projects = await sql`
      UPDATE projects 
      SET name = ${name}, description = ${description || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Projekt nie znaleziony" }, { status: 404 })
    }

    return NextResponse.json(projects[0])
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Delete related tasks first
    await sql`DELETE FROM tasks WHERE project_id = ${id}`
    await sql`DELETE FROM project_members WHERE project_id = ${id}`

    const result = await sql`
      DELETE FROM projects WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Projekt nie znaleziony" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}
