"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { FeedbackEmoji } from "@/components/feedback-emoji"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export function FeedbackComments() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

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
          setFilteredFeedback(feedbackWithComments)
        }
      } catch (error) {
        console.error("Error loading feedback data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [])

  // Apply filters when search term or filters change
  useEffect(() => {
    let filtered = [...feedbackData]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (feedback.tags && feedback.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
      )
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((feedback) => feedback.feedbackType && selectedTypes.includes(feedback.feedbackType))
    }

    // Apply rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((feedback) => selectedRatings.includes(feedback.rating))
    }

    setFilteredFeedback(filtered)
  }, [searchTerm, selectedTypes, selectedRatings, feedbackData])

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedRatings([])
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
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search comments or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-purple-950/50 border-purple-500/30 text-white"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-purple-950/50 border-purple-500/30 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-purple-950 border-purple-500/30 text-white">
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("general")}
                  onCheckedChange={() => handleTypeToggle("general")}
                >
                  General
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("prediction")}
                  onCheckedChange={() => handleTypeToggle("prediction")}
                >
                  Prediction
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("interface")}
                  onCheckedChange={() => handleTypeToggle("interface")}
                >
                  Interface
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("feature")}
                  onCheckedChange={() => handleTypeToggle("feature")}
                >
                  Feature Request
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-purple-950/50 border-purple-500/30 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Rating
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-purple-950 border-purple-500/30 text-white">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <DropdownMenuCheckboxItem
                    key={rating}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => handleRatingToggle(rating)}
                  >
                    {rating} Star{rating !== 1 ? "s" : ""}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchTerm || selectedTypes.length > 0 || selectedRatings.length > 0) && (
              <Button variant="ghost" onClick={clearFilters} className="text-purple-300 hover:text-purple-100">
                Clear
              </Button>
            )}
          </div>
        </div>

        {filteredFeedback.length === 0 ? (
          <p className="text-purple-200 text-center py-8">No feedback matches your filters.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence>
              {filteredFeedback.map((feedback, index) => (
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
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-purple-300">
                        {formatDistanceToNow(new Date(feedback.timestamp), { addSuffix: true })}
                      </span>
                      {feedback.predictedCGPA !== undefined && (
                        <span className="text-xs text-purple-400 mt-1">
                          Predicted CGPA: {feedback.predictedCGPA?.toFixed(2) || 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>

                  {feedback.feedbackType && (
                    <div className="mb-2">
                      <Badge className="bg-purple-700/50 text-purple-100 capitalize">{feedback.feedbackType}</Badge>
                    </div>
                  )}

                  <p className="text-purple-100">{feedback.comment}</p>

                  {feedback.tags && feedback.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {feedback.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-purple-800/30 text-purple-200 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-purple-500/20 px-6 py-4">
        <div className="text-sm text-purple-300">
          Showing {filteredFeedback.length} of {feedbackData.length} comments
        </div>
      </CardFooter>
    </Card>
  )
}
