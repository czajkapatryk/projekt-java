import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Wszystkie pola są wymagane" }, { status: 400 })
    }

    // Check if user exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Użytkownik z tym emailem już istnieje" }, { status: 409 })
    }

    // Create user (in production hash the password with bcrypt)
    const newUsers = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (${email}, ${password}, ${firstName}, ${lastName}, 'USER')
      RETURNING id, email, first_name, last_name, role
    `

    const user = newUsers[0]
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
    console.error("Register error:", error)
    return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 })
  }
}
