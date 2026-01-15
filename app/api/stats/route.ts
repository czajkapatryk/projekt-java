import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    // Note: If Java backend doesn't have a stats endpoint, we'll need to create one
    // For now, this will proxy to a potential /api/v1/stats endpoint
    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/stats`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 404) {
      // Stats endpoint doesn't exist yet - return basic structure
      // Frontend can calculate stats from projects and tasks
      return NextResponse.json({
        projects: 0,
        totalTasks: 0,
        todoTasks: 0,
        inProgressTasks: 0,
        doneTasks: 0,
      })
    }

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Stats proxy error:", error)
    // Return empty stats if backend is not available
    return NextResponse.json({
      projects: 0,
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0,
    })
  }
}
