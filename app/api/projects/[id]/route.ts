import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

// GET single project
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/projects/${id}`, {
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
    const mappedProject = {
      id: String(data.id),
      name: data.name,
      description: data.description,
      owner_id: String(data.owner?.id || ""),
      owner_name: data.owner ? `${data.owner.firstName} ${data.owner.lastName}` : undefined,
      task_count: data.taskCount || 0,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    }

    return NextResponse.json(mappedProject)
  } catch (error) {
    console.error("Get project proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}

// PUT update project
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/projects/${id}`, {
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
    const mappedProject = {
      id: String(data.id),
      name: data.name,
      description: data.description,
      owner_id: String(data.owner?.id || ""),
      owner_name: data.owner ? `${data.owner.firstName} ${data.owner.lastName}` : undefined,
      task_count: data.taskCount || 0,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    }

    return NextResponse.json(mappedProject)
  } catch (error) {
    console.error("Update project proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/projects/${id}`, {
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
    console.error("Delete project proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}
