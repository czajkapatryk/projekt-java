import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

// GET single task
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/tasks/${id}`, {
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

    return NextResponse.json(mappedTask)
  } catch (error) {
    console.error("Get task proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}

// PUT update task
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

    return NextResponse.json(mappedTask)
  } catch (error) {
    console.error("Update task proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}

// DELETE task
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete task proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}
