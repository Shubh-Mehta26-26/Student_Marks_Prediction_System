import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get feedback data
    const data = await request.json()

    // Validate input
    if (!data.rating || !data.predictionId) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    // In a real application, this would save to a database
    // For now, we'll simulate a successful submission

    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString()
    }

    // Add student ID from authenticated user
    data.studentId = user.id

    // Generate a unique ID for the feedback
    const feedbackId = Date.now().toString()

    return NextResponse.json({
      success: true,
      feedback: {
        id: feedbackId,
        ...data,
      },
    })
  } catch (error: any) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: error.message || "Feedback submission failed" }, { status: 500 })
  }
}
