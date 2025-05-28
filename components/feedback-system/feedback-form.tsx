"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { usePrediction } from "@/lib/prediction-context"
import { useAuth } from "@/lib/auth-context"
import { Star, Smile, Frown, Meh, SmilePlus, Loader2, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"
import { FeedbackTags } from "./feedback-tags"

type Sentiment = "very_dissatisfied" | "dissatisfied" | "neutral" | "satisfied" | "very_satisfied"

export function FeedbackForm() {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [sentiment, setSentiment] = useState<Sentiment>("neutral")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedbackType, setFeedbackType] = useState<"general" | "prediction" | "interface" | "feature">("general")

  const { toast } = useToast()
  const { predictions } = usePrediction()
  const { user } = useAuth()

  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null

  useEffect(() => {
    // Update sentiment based on rating
    if (rating === 0) {
      setSentiment("neutral")
    } else if (rating === 1) {
      setSentiment("very_dissatisfied")
    } else if (rating === 2) {
      setSentiment("dissatisfied")
    } else if (rating === 3) {
      setSentiment("neutral")
    } else if (rating === 4) {
      setSentiment("satisfied")
    } else if (rating === 5) {
      setSentiment("very_satisfied")
    }
  }, [rating])

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting your feedback.",
        variant: "destructive",
      })
      return
    }

    if (!user || !latestPrediction) {
      toast({
        title: "Error",
        description: "User or prediction data is missing.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare feedback data
      const feedbackData = {
        studentId: user.id,
        predictionId: latestPrediction.id || Date.now(),
        rating,
        sentiment,
        comment: comment.trim(),
        tags: selectedTags,
        feedbackType,
        predictedCGPA: latestPrediction.cgpa,
        timestamp: new Date().toISOString(),
      }

      // In a real application, this would be an API call
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Trigger confetti animation on success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#9333ea", "#6366f1", "#4f46e5"],
      })

      // Show success message
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our prediction system.",
        variant: "default",
      })

      // Reset form and mark as submitted
      setIsSubmitted(true)

      // Store feedback in localStorage for demo purposes
      const existingFeedback = JSON.parse(localStorage.getItem("feedback") || "[]")
      localStorage.setItem("feedback", JSON.stringify([...existingFeedback, feedbackData]))
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "very_dissatisfied":
        return <Frown className="h-12 w-12 text-red-500" />
      case "dissatisfied":
        return <Frown className="h-12 w-12 text-orange-500" />
      case "neutral":
        return <Meh className="h-12 w-12 text-yellow-500" />
      case "satisfied":
        return <Smile className="h-12 w-12 text-green-500" />
      case "very_satisfied":
        return <SmilePlus className="h-12 w-12 text-emerald-500" />
      default:
        return <Meh className="h-12 w-12 text-yellow-500" />
    }
  }

  const getSentimentMessage = () => {
    switch (sentiment) {
      case "very_dissatisfied":
        return "We're sorry to hear that. Please let us know how we can improve."
      case "dissatisfied":
        return "We'll work on making this better."
      case "neutral":
        return "Thanks for your feedback."
      case "satisfied":
        return "We're glad you found this helpful!"
      case "very_satisfied":
        return "Awesome! We're thrilled you're happy with the prediction!"
      default:
        return "We value your feedback."
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm overflow-hidden">
          <CardContent className="pt-6 pb-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-purple-200">Your feedback has been submitted successfully.</p>
              <Button
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  setIsSubmitted(false)
                  setRating(0)
                  setComment("")
                  setSelectedTags([])
                  setFeedbackType("general")
                  setIsExpanded(false)
                }}
              >
                Submit Another Feedback
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">How was your experience?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {getSentimentIcon()}
            </motion.div>

            <motion.p
              className="text-purple-200 text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {getSentimentMessage()}
            </motion.p>

            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                    } transition-colors duration-200`}
                  />
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {(isExpanded || rating > 0) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full overflow-hidden space-y-4"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-purple-200">What type of feedback are you providing?</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeedbackType("general")}
                        className={`${feedbackType === "general" ? "bg-purple-600 text-white border-purple-600" : "bg-purple-950/50 text-purple-200 border-purple-500/30"}`}
                      >
                        General
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeedbackType("prediction")}
                        className={`${feedbackType === "prediction" ? "bg-purple-600 text-white border-purple-600" : "bg-purple-950/50 text-purple-200 border-purple-500/30"}`}
                      >
                        Prediction
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeedbackType("interface")}
                        className={`${feedbackType === "interface" ? "bg-purple-600 text-white border-purple-600" : "bg-purple-950/50 text-purple-200 border-purple-500/30"}`}
                      >
                        Interface
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeedbackType("feature")}
                        className={`${feedbackType === "feature" ? "bg-purple-600 text-white border-purple-600" : "bg-purple-950/50 text-purple-200 border-purple-500/30"}`}
                      >
                        Feature Request
                      </Button>
                    </div>
                  </div>

                  <FeedbackTags selectedTags={selectedTags} onTagSelect={handleTagSelect} feedbackType={feedbackType} />

                  <Textarea
                    placeholder="Tell us more about your experience with our prediction system..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-purple-950/50 border-purple-500/30 text-white min-h-[120px] resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
