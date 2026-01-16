import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/tasks/assignee/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Map Java backend response to frontend format
    const mappedTasks = Array.isArray(data) ? data.map((t: any) => ({
      id: String(t.id),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      project_id: String(t.project?.id || ""),
      assignee_id: t.assignee ? String(t.assignee.id) : null,
      assignee_name: t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : null,
      due_date: t.dueDate || null,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
    })) : []

    return NextResponse.json(mappedTasks)
  } catch (error) {
    console.error("Get user tasks proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}
