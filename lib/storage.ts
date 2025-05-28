// Local storage functions for prediction history

type Prediction = {
  date: string
  attendance: number
  participation: string
  assignment: string
  previousCGPA: number
  subject1: number
  subject2: number
  subject3: number
  subject4: number
  interest: number
  predictedCGPA: number
}

const STORAGE_KEY = "student_predictions"

export function savePrediction(prediction: Prediction): void {
  // Get existing predictions
  const predictions = getPredictions()

  // Add new prediction
  predictions.push(prediction)

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions))
  }
}

export function getPredictions(): Prediction[] {
  if (typeof window === "undefined") {
    return []
  }

  const storedData = localStorage.getItem(STORAGE_KEY)

  if (!storedData) {
    return []
  }

  try {
    return JSON.parse(storedData)
  } catch (error) {
    console.error("Error parsing prediction data:", error)
    return []
  }
}

export function clearPredictions(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
