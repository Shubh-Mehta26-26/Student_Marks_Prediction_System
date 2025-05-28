import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email and password are required" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await createUser(username, email, hashedPassword)

    // Generate token
    const token = generateToken({ id: user.id, email, username })

    // Set cookie
    setAuthCookie(token)

    return NextResponse.json({ success: true, user: { id: user.id, email, username } })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
