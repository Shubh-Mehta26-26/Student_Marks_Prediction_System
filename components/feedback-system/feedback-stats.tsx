"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FeedbackEmoji } from "@/components/feedback-emoji"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Doughnut, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Badge } from "@/components/ui/badge"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

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

export function FeedbackStats() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

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

  // Prepare chart data for ratings
  const ratingChartData = {
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

  // Calculate feedback type distribution
  const feedbackTypes = {
    general: 0,
    prediction: 0,
    interface: 0,
    feature: 0,
  }

  feedbackData.forEach((feedback) => {
    if (feedback.feedbackType) {
      feedbackTypes[feedback.feedbackType as keyof typeof feedbackTypes]++
    } else {
      feedbackTypes.general++
    }
  })

  // Prepare chart data for feedback types
  const typeChartData = {
    labels: ["General", "Prediction", "Interface", "Feature"],
    datasets: [
      {
        label: "Feedback by Type",
        data: [feedbackTypes.general, feedbackTypes.prediction, feedbackTypes.interface, feedbackTypes.feature],
        backgroundColor: [
          "rgba(153, 102, 255, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: ["rgb(153, 102, 255)", "rgb(54, 162, 235)", "rgb(75, 192, 192)", "rgb(255, 159, 64)"],
        borderWidth: 1,
      },
    ],
  }

  // Calculate tag frequency
  const tagFrequency: Record<string, number> = {}

  feedbackData.forEach((feedback) => {
    if (feedback.tags && Array.isArray(feedback.tags)) {
      feedback.tags.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    }
  })

  // Sort tags by frequency
  const sortedTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10 tags

  // Prepare chart data for tags
  const tagChartData = {
    labels: sortedTags.map(([tag]) => tag),
    datasets: [
      {
        label: "Tag Frequency",
        data: sortedTags.map(([, count]) => count),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgb(153, 102, 255)",
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

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#a78bfa",
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
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-purple-900/30 border border-purple-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="types" className="data-[state=active]:bg-purple-600">
              Feedback Types
            </TabsTrigger>
            <TabsTrigger value="tags" className="data-[state=active]:bg-purple-600">
              Popular Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
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
                <Doughnut data={ratingChartData} options={chartOptions} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="types" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Feedback by Type</h3>
                  <div className="space-y-3">
                    {Object.entries(feedbackTypes).map(([type, count]) => {
                      const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200 capitalize">{type}</span>
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
                  <h3 className="text-lg font-medium text-white mb-2">Type Analysis</h3>
                  <p className="text-purple-200">
                    {Object.entries(feedbackTypes).sort((a, b) => b[1] - a[1])[0][0] === "general"
                      ? "Most feedback is general. Consider adding more specific feedback options."
                      : `Most feedback is about ${Object.entries(feedbackTypes).sort((a, b) => b[1] - a[1])[0][0]}.`}
                  </p>
                </div>
              </div>

              <div className="h-64">
                <Doughnut data={typeChartData} options={chartOptions} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tags" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Most Used Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {sortedTags.map(([tag, count]) => (
                      <Badge key={tag} variant="outline" className="bg-purple-900/30 text-purple-200">
                        {tag} ({count})
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Tag Insights</h3>
                  <p className="text-purple-200">
                    {sortedTags.length > 0
                      ? `"${sortedTags[0][0]}" is the most frequently used tag, appearing in ${Math.round((sortedTags[0][1] / totalFeedback) * 100)}% of feedback.`
                      : "No tags have been used yet."}
                  </p>
                </div>
              </div>

              <div className="h-64">
                <Bar data={tagChartData} options={barChartOptions} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
