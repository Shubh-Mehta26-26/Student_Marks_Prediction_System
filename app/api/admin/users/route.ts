import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllUsers, deleteUser } from "@/lib/db"

// Check if user is admin (in a real app, you'd have an admin flag in the database)
async function isAdmin(userId: number) {
  // For demo purposes, let's consider user with ID 1 as admin
  return userId === 1
}

export async function GET() {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if admin
    if (!(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get all users
    const users = await getAllUsers()

    return NextResponse.json({ success: true, users })
  } catch (error: any) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: error.message || "Failed to get users" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if admin
    if (!(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get user ID to delete
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Delete user
    await deleteUser(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 })
  }
}
