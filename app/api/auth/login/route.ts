import { type NextRequest, NextResponse } from "next/server"

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!JAVA_BACKEND_URL || JAVA_BACKEND_URL === "http://localhost:8080") {
      console.error("JAVA_BACKEND_URL not configured:", JAVA_BACKEND_URL)
      return NextResponse.json(
        { error: "Backend URL nie jest skonfigurowany. Ustaw zmienną JAVA_BACKEND_URL w Vercel." },
        { status: 503 }
      )
    }
    
    const backendUrl = `${JAVA_BACKEND_URL}/api/v1/auth/login`
    console.log("Calling backend:", backendUrl)
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText || `Backend error: ${response.status}` }
      }
      console.error("Backend error:", response.status, errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()

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
      { error: `Nie można połączyć się z serwerem: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 503 }
    )
  }
}
