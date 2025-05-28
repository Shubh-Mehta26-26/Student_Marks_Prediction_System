import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllPredictions } from "@/lib/db"

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

    // Get all predictions
    const predictions = await getAllPredictions()

    return NextResponse.json({ success: true, predictions })
  } catch (error: any) {
    console.error("Get predictions error:", error)
    return NextResponse.json({ error: error.message || "Failed to get predictions" }, { status: 500 })
  }
}
