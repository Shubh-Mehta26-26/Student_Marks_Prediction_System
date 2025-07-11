"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Subject = {
  name: string
  marks: number
}

export type PracticalSubject = {
  name: string
  marks: number
}

export type PredictionData = {
  attendance: number
  participation: number
  assignment: string
  previousCGPA: number
  interest: number
  subjects: Subject[]
  practicalSubjects: PracticalSubject[]
}

export type PredictionResult = {
  id: string
  date: string
  cgpa: number
  message: string
  tips: string[]
  weakestSubject: string
  weakestPractical?: string
  data: PredictionData
}

type PredictionContextType = {
  predictions: PredictionResult[]
  addPrediction: (data: PredictionData, result: Omit<PredictionResult, "id" | "date" | "data">) => void
  getPredictionHistory: () => PredictionResult[]
  clearPredictions: () => void
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined)

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<PredictionResult[]>([])

  // Load predictions from localStorage on initial load
  useEffect(() => {
    const storedPredictions = localStorage.getItem("predictions")
    if (storedPredictions) {
      setPredictions(JSON.parse(storedPredictions))
    } else {
      // Add sample predictions for demo purposes
      const samplePredictions: PredictionResult[] = [
        {
          id: "1",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          cgpa: 7.5,
          message: "Good performance. There's room for improvement, especially in your weaker subjects.",
          tips: ["Try to improve your attendance to at least 75% for better results."],
          weakestSubject: "DSA",
          data: {
            attendance: 65,
            participation: 7,
            assignment: "yes",
            previousCGPA: 7.2,
            interest: 70,
            subjects: [
              { name: "C Programming", marks: 40 },
              { name: "DSA", marks: 38 },
              { name: "Java Programming", marks: 42 },
            ],
            practicalSubjects: [
              { name: "DSA Lab", marks: 20 },
              { name: "Java Programming Lab", marks: 25 },
            ],
          },
        },
        {
          id: "2",
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          cgpa: 7.8,
          message: "Very good! You're performing well. With a bit more effort, you could achieve excellence.",
          tips: ["Focus more on DSA as it's your weakest subject."],
          weakestSubject: "DSA",
          weakestPractical: "DSA Lab",
          data: {
            attendance: 70,
            participation: 8,
            assignment: "yes",
            previousCGPA: 7.5,
            interest: 75,
            subjects: [
              { name: "C Programming", marks: 42 },
              { name: "DSA", marks: 40 },
              { name: "Java Programming", marks: 45 },
            ],
            practicalSubjects: [
              { name: "DSA Lab", marks: 22 },
              { name: "Java Programming Lab", marks: 26 },
            ],
          },
        },
        {
          id: "3",
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          cgpa: 8.1,
          message: "Very good! You're performing well. With a bit more effort, you could achieve excellence.",
          tips: ["Keep up the good work!"],
          weakestSubject: "DSA",
          data: {
            attendance: 75,
            participation: 9,
            assignment: "yes",
            previousCGPA: 7.8,
            interest: 80,
            subjects: [
              { name: "C Programming", marks: 45 },
              { name: "DSA", marks: 43 },
              { name: "Java Programming", marks: 47 },
            ],
            practicalSubjects: [
              { name: "DSA Lab", marks: 24 },
              { name: "Java Programming Lab", marks: 27 },
            ],
          },
        },
      ]
      setPredictions(samplePredictions)
      localStorage.setItem("predictions", JSON.stringify(samplePredictions))
    }
  }, [])

  const addPrediction = (data: PredictionData, result: Omit<PredictionResult, "id" | "date" | "data">) => {
    const newPrediction: PredictionResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...result,
      data,
    }

    const updatedPredictions = [...predictions, newPrediction]
    setPredictions(updatedPredictions)
    localStorage.setItem("predictions", JSON.stringify(updatedPredictions))
  }

  const getPredictionHistory = () => {
    return predictions
  }

  const clearPredictions = () => {
    setPredictions([])
    localStorage.removeItem("predictions")
  }

  return (
    <PredictionContext.Provider
      value={{
        predictions,
        addPrediction,
        getPredictionHistory,
        clearPredictions,
      }}
    >
      {children}
    </PredictionContext.Provider>
  )
}

export function usePrediction() {
  const context = useContext(PredictionContext)
  if (context === undefined) {
    throw new Error("usePrediction must be used within a PredictionProvider")
  }
  return context
}
