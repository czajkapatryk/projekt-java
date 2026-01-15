import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email i hasło są wymagane" }, { status: 400 })
    }

    // Find user by email
    const users = await sql`
      SELECT id, email, password_hash, first_name, last_name, role 
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Nieprawidłowy email lub hasło" }, { status: 401 })
    }

    const user = users[0]

    // Simple password check (in production use bcrypt)
    if (user.password_hash !== password) {
      return NextResponse.json({ error: "Nieprawidłowy email lub hasło" }, { status: 401 })
    }

    // Create simple token (in production use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}
