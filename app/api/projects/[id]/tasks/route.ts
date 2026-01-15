import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

// GET tasks for project
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/tasks/project/${id}`, {
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
    console.error("Get tasks proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}

// POST create task
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const body = await request.json()
    // Add projectId to the request body
    const taskRequest = {
      ...body,
      projectId: parseInt(id),
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/tasks`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskRequest),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Map Java backend response to frontend format
    const mappedTask = {
      id: String(data.id),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      project_id: String(data.project?.id || ""),
      assignee_id: data.assignee ? String(data.assignee.id) : null,
      assignee_name: data.assignee ? `${data.assignee.firstName} ${data.assignee.lastName}` : null,
      due_date: data.dueDate || null,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    }

    return NextResponse.json(mappedTask, { status: response.status })
  } catch (error) {
    console.error("Create task proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}
