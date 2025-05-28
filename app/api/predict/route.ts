import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { savePrediction } from "@/lib/db"
import { predictCGPA } from "@/lib/ml-model"

export async function POST(request: Request) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get prediction data
    const data = await request.json()

    // Validate input
    if (!data.attendance || !data.participation || data.subjects?.length < 3) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    // Make prediction
    const prediction = predictCGPA({
      attendance: data.attendance,
      participation: data.participation,
      assignment: data.assignment === "yes",
      previousCGPA: data.previousCGPA,
      interest: data.interest,
      subjects: data.subjects,
    })

    // Save prediction to database
    const savedPrediction = await savePrediction({
      studentId: user.id,
      ...data,
      predictedCGPA: prediction.cgpa,
    })

    return NextResponse.json({
      success: true,
      prediction: {
        id: savedPrediction.id,
        cgpa: prediction.cgpa,
        message: prediction.message,
        tips: prediction.tips,
        weakestSubject: prediction.weakestSubject,
      },
    })
  } catch (error: any) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: error.message || "Prediction failed" }, { status: 500 })
  }
}
