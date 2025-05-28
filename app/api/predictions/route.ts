import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPredictionsByStudentId } from "@/lib/db"

export async function GET() {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get predictions
    const predictions = await getPredictionsByStudentId(user.id)

    return NextResponse.json({ success: true, predictions })
  } catch (error: any) {
    console.error("Get predictions error:", error)
    return NextResponse.json({ error: error.message || "Failed to get predictions" }, { status: 500 })
  }
}
