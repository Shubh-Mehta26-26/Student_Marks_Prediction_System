"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { format, subDays, isAfter, parseISO } from "date-fns"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

type FeedbackData = {
  studentId: number
  predictionId: number
  rating: number
  sentiment: string
  comment: string
  tags?: string[]
  feedbackType?: string
  predictedCGPA: number
  timestamp: string
}

export function FeedbackAnalytics() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month")

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll load from localStorage
    const loadFeedback = () => {
      try {
        const storedFeedback = localStorage.getItem("feedback")
        if (storedFeedback) {
          const parsedFeedback = JSON.parse(storedFeedback)
          // Sort by timestamp (oldest first for timeline)
          parsedFeedback.sort(
            (a: FeedbackData, b: FeedbackData) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
          setFeedbackData(parsedFeedback)
        }
      } catch (error) {
        console.error("Error loading feedback data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [])

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === "all") return feedbackData

    const cutoffDate = timeRange === "week" ? subDays(new Date(), 7) : subDays(new Date(), 30)
    return feedbackData.filter((item) => isAfter(parseISO(item.timestamp), cutoffDate))
  }

  // Prepare data for rating trend chart
  const prepareRatingTrendData = () => {
    const filteredData = getFilteredData()
    if (filteredData.length === 0) return null

    // Group by date
    const groupedByDate: Record<string, number[]> = {}

    filteredData.forEach((item) => {
      const date = format(new Date(item.timestamp), "yyyy-MM-dd")
      if (!groupedByDate[date]) {
        groupedByDate[date] = []
      }
      groupedByDate[date].push(item.rating)
    })

    // Calculate average rating per day
    const labels: string[] = []
    const data: number[] = []

    Object.entries(groupedByDate).forEach(([date, ratings]) => {
      const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      labels.push(format(new Date(date), "MMM d"))
      data.push(Number.parseFloat(avgRating.toFixed(2)))
    })

    return {
      labels,
      datasets: [
        {
          label: "Average Rating",
          data,
          borderColor: "rgb(147, 51, 234)",
          backgroundColor: "rgba(147, 51, 234, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
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
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 5,
        ticks: {
          color: "#a78bfa",
          stepSize: 1,
        },
        grid: {
          color: "rgba(167, 139, 250, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#a78bfa",
        },
        grid: {
          display: false,
        },
      },
    },
  }

  const ratingTrendData = prepareRatingTrendData()

  if (loading) {
    return (
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
        <CardContent className="p-6 flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    )
  }

  if (feedbackData.length === 0) {
    return (
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Feedback Trends</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-purple-200 text-center">No feedback data available yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Feedback Trends</CardTitle>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "week"
                ? "bg-purple-600 text-white"
                : "bg-purple-900/30 text-purple-200 hover:bg-purple-900/50"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "month"
                ? "bg-purple-600 text-white"
                : "bg-purple-900/30 text-purple-200 hover:bg-purple-900/50"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "all"
                ? "bg-purple-600 text-white"
                : "bg-purple-900/30 text-purple-200 hover:bg-purple-900/50"
            }`}
          >
            All Time
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {ratingTrendData ? (
          <div className="h-64">
            <Line data={ratingTrendData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-purple-200 text-center">No data available for the selected time range.</p>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-purple-200 mb-1">Average Rating</h3>
            <p className="text-2xl font-bold text-white">
              {getFilteredData().length > 0
                ? (getFilteredData().reduce((sum, item) => sum + item.rating, 0) / getFilteredData().length).toFixed(1)
                : "N/A"}
            </p>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-purple-200 mb-1">Total Feedback</h3>
            <p className="text-2xl font-bold text-white">{getFilteredData().length}</p>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-purple-200 mb-1">Satisfaction Rate</h3>
            <p className="text-2xl font-bold text-white">
              {getFilteredData().length > 0
                ? `${Math.round(
                    (getFilteredData().filter((item) => item.rating >= 4).length / getFilteredData().length) * 100,
                  )}%`
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
