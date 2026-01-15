import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/projects`, {
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
    // Java returns Page<ProjectResponse> with content array
    // Frontend expects array of projects
    const projects = data.content || data
    const mappedProjects = Array.isArray(projects) ? projects.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      description: p.description,
      owner_id: String(p.owner?.id || ""),
      owner_name: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : undefined,
      task_count: p.taskCount || 0,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    })) : []

    return NextResponse.json(mappedProjects)
  } catch (error) {
    console.error("Get projects proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}

// POST create project
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/projects`, {
      method: "POST",
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

    return NextResponse.json(mappedProject, { status: response.status })
  } catch (error) {
    console.error("Create project proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}
