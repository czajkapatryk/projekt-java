import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${JAVA_BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({
      token: data.accessToken,
      user: {
        id: String(data.user.id),
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
      },
    })
  } catch (error) {
    console.error("Login proxy error:", error)
    return NextResponse.json(
      { error: "Nie można połączyć się z serwerem" },
      { status: 503 }
    )
  }
}
