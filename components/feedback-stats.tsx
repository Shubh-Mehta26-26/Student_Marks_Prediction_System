"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FeedbackEmoji } from "@/components/feedback-emoji"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

type FeedbackData = {
  studentId: number
  predictionId: number
  rating: number
  sentiment: string
  comment: string
  predictedCGPA: number
  timestamp: string
}

export function FeedbackStats() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll load from localStorage
    const loadFeedback = () => {
      try {
        const storedFeedback = localStorage.getItem("feedback")
        if (storedFeedback) {
          setFeedbackData(JSON.parse(storedFeedback))
        }
      } catch (error) {
        console.error("Error loading feedback data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [])

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // For ratings 1-5

  feedbackData.forEach((feedback) => {
    if (feedback.rating >= 1 && feedback.rating <= 5) {
      ratingCounts[feedback.rating - 1]++
    }
  })

  const totalFeedback = feedbackData.length
  const averageRating = totalFeedback > 0 ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / totalFeedback : 0

  // Prepare chart data
  const chartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        data: ratingCounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.7)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#a78bfa",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  }

  if (loading) {
    return (
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
        <CardContent className="p-6 flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    )
  }

  if (totalFeedback === 0) {
    return (
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Feedback Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-purple-200 text-center">No feedback data available yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Feedback Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Average Rating</h3>
                <p className="text-purple-200">{averageRating.toFixed(1)} out of 5</p>
              </div>
              <div className="flex items-center">
                {averageRating < 1.5 && <FeedbackEmoji sentiment="very_dissatisfied" />}
                {averageRating >= 1.5 && averageRating < 2.5 && <FeedbackEmoji sentiment="dissatisfied" />}
                {averageRating >= 2.5 && averageRating < 3.5 && <FeedbackEmoji sentiment="neutral" />}
                {averageRating >= 3.5 && averageRating < 4.5 && <FeedbackEmoji sentiment="satisfied" />}
                {averageRating >= 4.5 && <FeedbackEmoji sentiment="very_satisfied" />}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingCounts[rating - 1]
                  const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0

                  return (
                    <div key={rating} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-200">
                          {rating} Star{rating !== 1 ? "s" : ""}
                        </span>
                        <span className="text-purple-200">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Total Feedback</h3>
              <p className="text-purple-200">{totalFeedback} submissions</p>
            </div>
          </div>

          <div className="h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
