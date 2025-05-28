import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { saveFeedback, getFeedbackByStudentId, getAllFeedback } from "@/lib/db"

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

    // Save feedback to database
    const savedFeedback = await saveFeedback({
      studentId: user.id,
      predictionId: data.predictionId,
      rating: data.rating,
      sentiment: data.sentiment,
      comment: data.comment || "",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      feedback: {
        id: savedFeedback.id,
      },
    })
  } catch (error: any) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: error.message || "Feedback submission failed" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = user.role === "admin"

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    // Get feedback data
    let feedbackData

    if (isAdmin && !studentId) {
      // Admin can see all feedback
      feedbackData = await getAllFeedback()
    } else if (isAdmin && studentId) {
      // Admin can filter by student
      feedbackData = await getFeedbackByStudentId(Number(studentId))
    } else {
      // Regular users can only see their own feedback
      feedbackData = await getFeedbackByStudentId(user.id)
    }

    return NextResponse.json({
      success: true,
      feedback: feedbackData,
    })
  } catch (error: any) {
    console.error("Feedback retrieval error:", error)
    return NextResponse.json({ error: error.message || "Feedback retrieval failed" }, { status: 500 })
  }
}
