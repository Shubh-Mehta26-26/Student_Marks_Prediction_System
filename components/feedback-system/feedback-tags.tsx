"use client"

import { Badge } from "@/components/ui/badge"

interface FeedbackTagsProps {
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  feedbackType: "general" | "prediction" | "interface" | "feature"
}

export function FeedbackTags({ selectedTags, onTagSelect, feedbackType }: FeedbackTagsProps) {
  // Define tags based on feedback type
  const getTags = () => {
    switch (feedbackType) {
      case "prediction":
        return [
          "Accuracy",
          "Speed",
          "Relevance",
          "Explanation",
          "Subject Analysis",
          "Practical Analysis",
          "Improvement Tips",
        ]
      case "interface":
        return [
          "Design",
          "Navigation",
          "Responsiveness",
          "Accessibility",
          "Animations",
          "Colors",
          "Layout",
          "Usability",
        ]
      case "feature":
        return [
          "Study Plan",
          "Chatbot",
          "Analytics",
          "Notifications",
          "Mobile App",
          "Offline Mode",
          "Collaboration",
          "Customization",
        ]
      default:
        return ["Helpful", "Easy to Use", "Informative", "Innovative", "Reliable", "Fast", "Intuitive", "Comprehensive"]
    }
  }

  const tags = getTags()

  return (
    <div className="space-y-2">
      <p className="text-sm text-purple-200">Select relevant tags (optional)</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={`cursor-pointer transition-all ${
              selectedTags.includes(tag)
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-purple-950/30 hover:bg-purple-900/50 text-purple-200"
            }`}
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
