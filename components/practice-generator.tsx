"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, XCircle, RefreshCw, Download } from "lucide-react"

type Question = {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

type PracticeGeneratorProps = {
  subject: string
}

export function PracticeGenerator({ subject }: PracticeGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const generateQuestions = () => {
    setIsLoading(true)
    setShowResults(false)
    setSelectedAnswers({})

    // Simulate API call to generate questions
    setTimeout(() => {
      // Sample questions based on subject
      const sampleQuestions: Question[] = [
        {
          id: "q1",
          text: `What is the main concept in ${subject} that relates to problem-solving?`,
          options: ["Critical thinking", "Memorization", "Analytical reasoning", "Pattern recognition"],
          correctAnswer: 2,
        },
        {
          id: "q2",
          text: `Which formula is most important in ${subject}?`,
          options: ["Basic equation", "Advanced formula", "Fundamental principle", "Core theorem"],
          correctAnswer: 3,
        },
        {
          id: "q3",
          text: `How does ${subject} apply to real-world scenarios?`,
          options: ["Through practical applications", "By theoretical models", "Using simulations", "All of the above"],
          correctAnswer: 3,
        },
        {
          id: "q4",
          text: `What is the historical significance of ${subject}?`,
          options: [
            "It revolutionized the field",
            "It provided new insights",
            "It connected multiple disciplines",
            "It solved longstanding problems",
          ],
          correctAnswer: 0,
        },
        {
          id: "q5",
          text: `Which study technique is most effective for ${subject}?`,
          options: ["Flashcards", "Practice problems", "Group discussions", "Video tutorials"],
          correctAnswer: 1,
        },
      ]

      setQuestions(sampleQuestions)
      setCurrentQuestionIndex(0)
      setIsLoading(false)
    }, 1500)
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++
      }
    })
    return correctCount
  }

  const resetPractice = () => {
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
    setShowResults(false)
  }

  const downloadPractice = () => {
    // In a real app, this would generate a PDF
    alert("Practice questions would be downloaded as PDF")
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
          <p className="text-lg text-center">Generating practice questions for {subject}...</p>
        </CardContent>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Practice Questions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <p className="text-center mb-6">Generate practice questions to improve your performance in {subject}</p>
          <Button onClick={generateQuestions} className="bg-purple-600 hover:bg-purple-700">
            Generate Questions
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = (score / questions.length) * 100

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Practice Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-32 h-32 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-purple-600">
                {score}/{questions.length}
              </span>
            </div>
            <p className="text-lg font-medium mb-2">You scored {percentage.toFixed(0)}%</p>
            <p className="text-center mb-6">
              {percentage >= 80
                ? "Excellent! You have a good understanding of this subject."
                : percentage >= 60
                  ? "Good job! Keep practicing to improve further."
                  : "You need more practice with this subject."}
            </p>

            <div className="w-full space-y-4 mt-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-2">
                      {selectedAnswers[question.id] === question.correctAnswer ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        Question {index + 1}: {question.text}
                      </p>
                      <p className="text-sm mt-1">Your answer: {question.options[selectedAnswers[question.id] || 0]}</p>
                      {selectedAnswers[question.id] !== question.correctAnswer && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetPractice} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={downloadPractice} className="bg-purple-600 hover:bg-purple-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download Practice Sheet
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Practice Question {currentQuestionIndex + 1}/{questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg mb-6">{currentQuestion.text}</p>

          <RadioGroup
            value={selectedAnswers[currentQuestion.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, Number.parseInt(value))}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button
          onClick={handleNextQuestion}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={selectedAnswers[currentQuestion.id] === undefined}
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}
