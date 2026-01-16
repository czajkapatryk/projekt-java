import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })
    }

    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/users`, {
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
    const mappedUsers = Array.isArray(data) ? data.map((u: any) => ({
      id: String(u.id),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
    })) : []

    return NextResponse.json(mappedUsers)
  } catch (error) {
    console.error("Get users proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}
