import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const userId = Buffer.from(token, "base64").toString().split(":")[0]

    // Get user's projects
    const projectsResult = await sql`
      SELECT COUNT(*) as count FROM projects 
      WHERE owner_id = ${userId}
    `

    // Get tasks stats
    const tasksResult = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'TODO') as todo,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
        COUNT(*) FILTER (WHERE status = 'DONE') as done
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.owner_id = ${userId}
    `

    return NextResponse.json({
      projects: Number(projectsResult[0].count),
      totalTasks: Number(tasksResult[0].total),
      todoTasks: Number(tasksResult[0].todo),
      inProgressTasks: Number(tasksResult[0].in_progress),
      doneTasks: Number(tasksResult[0].done),
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}
