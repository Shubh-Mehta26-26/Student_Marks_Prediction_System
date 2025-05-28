"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackEmoji } from "@/components/feedback-emoji"
import { formatDistanceToNow } from "date-fns"

type FeedbackData = {
  studentId: number
  predictionId: number
  rating: number
  sentiment: string
  comment: string
  predictedCGPA: number
  timestamp: string
}

export function FeedbackComments() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll load from localStorage
    const loadFeedback = () => {
      try {
        const storedFeedback = localStorage.getItem("feedback")
        if (storedFeedback) {
          const parsedFeedback = JSON.parse(storedFeedback)
          // Filter to only include feedback with comments
          const feedbackWithComments = parsedFeedback.filter((item: FeedbackData) => item.comment.trim() !== "")
          // Sort by timestamp (newest first)
          feedbackWithComments.sort(
            (a: FeedbackData, b: FeedbackData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
          setFeedbackData(feedbackWithComments)
        }
      } catch (error) {
        console.error("Error loading feedback data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [])

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
          <CardTitle className="text-white">Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-purple-200 text-center">No feedback comments available yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <AnimatePresence>
            {feedbackData.map((feedback, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <FeedbackEmoji sentiment={feedback.sentiment as any} size="sm" animated={false} />
                    <div className="ml-2 flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < feedback.rating ? "text-yellow-400" : "text-gray-400"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-purple-300">
                    {formatDistanceToNow(new Date(feedback.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-purple-100">{feedback.comment}</p>
                <div className="mt-2 text-xs text-purple-300">Predicted CGPA: {feedback.predictedCGPA.toFixed(2)}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
