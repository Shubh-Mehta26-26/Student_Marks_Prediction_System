"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProfessionalCard } from "@/components/professional-card"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { ArrowRight, BookOpen, MessageSquare, ThumbsUp } from "lucide-react"
import { Badge3D } from "@/components/badge-3d"
import { PracticeGenerator } from "@/components/practice-generator"
import { FeedbackForm } from "@/components/feedback-form"
import { motion } from "framer-motion"

interface ResultProps {
  result: {
    cgpa: number
    message: string
    tips: string[]
    weakestSubject: string
    weakestPractical?: string
  }
  formData: any
  onReset: () => void
}

export function Result({ result, formData, onReset }: ResultProps) {
  const [showFeedback, setShowFeedback] = useState(false)

  return (
    <div className="space-y-8">
      <ProfessionalCard>
        <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 z-0"></div>
          <CardContent className="p-8 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Prediction Result</h2>
              <p className="text-purple-200">Based on your academic indicators</p>
            </div>

            <div className="flex flex-col items-center justify-center mb-8">
              <Badge3D cgpa={result.cgpa} />
              <h3 className="text-2xl font-semibold text-white mt-4">Predicted CGPA</h3>
            </div>

            <GlassmorphicCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Performance Analysis</h3>
                <p className="text-purple-100 mb-6">{result.message}</p>

                {result.tips.length > 0 && (
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-white mb-2">Improvement Tips:</h4>
                    <ul className="list-disc list-inside space-y-1 text-purple-200">
                      {result.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-white mb-4">Theory Subject Performance</h3>
                <div className="space-y-4 mb-6">
                  {formData.subjects.map((subject: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-purple-100">{subject.name}</span>
                        <span className="text-purple-100">{Math.round((subject.marks / 60) * 100)}%</span>
                      </div>
                      <Progress
                        value={(subject.marks / 60) * 100}
                        className="h-2"
                        indicatorClassName={
                          subject.marks < 30 ? "bg-red-500" : subject.marks < 45 ? "bg-yellow-500" : "bg-green-500"
                        }
                      />
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">Practical Subject Performance</h3>
                <div className="space-y-4">
                  {formData.practicalSubjects.map((subject: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-purple-100">{subject.name}</span>
                        <span className="text-purple-100">{Math.round((subject.marks / 30) * 100)}%</span>
                      </div>
                      <Progress
                        value={(subject.marks / 30) * 100}
                        className="h-2"
                        indicatorClassName={
                          subject.marks < 15 ? "bg-red-500" : subject.marks < 22 ? "bg-yellow-500" : "bg-green-500"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </GlassmorphicCard>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                variant="outline"
                onClick={onReset}
                className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
              >
                Try Another Prediction
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">View Dashboard</Button>
              </Link>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowFeedback(!showFeedback)}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {showFeedback ? "Hide Feedback" : "Give Feedback"}
              </Button>
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <FeedbackForm />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </ProfessionalCard>

      {result.cgpa < 6.0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ProfessionalCard>
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-6 w-6 text-purple-500 mr-2" />
                    <h3 className="text-lg font-medium text-white">Practice Questions</h3>
                  </div>
                  <PracticeGenerator subject={result.weakestSubject} />
                </CardContent>
              </Card>
            </ProfessionalCard>
          </div>

          <div>
            <ProfessionalCard>
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-6 w-6 text-purple-500 mr-2" />
                    <h3 className="text-lg font-medium text-white">AI Chatbot</h3>
                  </div>
                  <p className="text-purple-200 mb-6 flex-grow">
                    Get personalized guidance and answers to your academic questions from our AI assistant.
                  </p>
                  <p className="text-purple-200 mb-6">
                    Our AI can help you understand difficult concepts in {result.weakestSubject} and provide study tips
                    tailored to your learning style.
                  </p>
                  <Link href="/feedback">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      View Feedback System
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ProfessionalCard>
          </div>
        </div>
      )}
    </div>
  )
}
