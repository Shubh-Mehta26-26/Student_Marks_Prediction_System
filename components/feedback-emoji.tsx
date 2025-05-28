"use client"

import { motion } from "framer-motion"
import { Smile, Frown, Meh, SmilePlus, Angry } from "lucide-react"

type Sentiment = "very_dissatisfied" | "dissatisfied" | "neutral" | "satisfied" | "very_satisfied"

interface FeedbackEmojiProps {
  sentiment: Sentiment
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function FeedbackEmoji({ sentiment, size = "md", animated = true }: FeedbackEmojiProps) {
  const getSize = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6"
      case "md":
        return "h-10 w-10"
      case "lg":
        return "h-16 w-16"
      default:
        return "h-10 w-10"
    }
  }

  const getColor = () => {
    switch (sentiment) {
      case "very_dissatisfied":
        return "text-red-500"
      case "dissatisfied":
        return "text-orange-500"
      case "neutral":
        return "text-yellow-500"
      case "satisfied":
        return "text-green-500"
      case "very_satisfied":
        return "text-emerald-500"
      default:
        return "text-yellow-500"
    }
  }

  const getIcon = () => {
    switch (sentiment) {
      case "very_dissatisfied":
        return <Angry className={`${getSize()} ${getColor()}`} />
      case "dissatisfied":
        return <Frown className={`${getSize()} ${getColor()}`} />
      case "neutral":
        return <Meh className={`${getSize()} ${getColor()}`} />
      case "satisfied":
        return <Smile className={`${getSize()} ${getColor()}`} />
      case "very_satisfied":
        return <SmilePlus className={`${getSize()} ${getColor()}`} />
      default:
        return <Meh className={`${getSize()} ${getColor()}`} />
    }
  }

  if (!animated) {
    return getIcon()
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.1 }}
    >
      {getIcon()}
    </motion.div>
  )
}
