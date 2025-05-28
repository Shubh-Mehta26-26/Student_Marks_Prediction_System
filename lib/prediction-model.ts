// Simple prediction model using weighted factors

type FormData = {
  attendance: number
  participation: string
  assignment: string
  previousCGPA: number
  subject1: number
  subject2: number
  subject3: number
  subject4: number
  interest: number
}

export function predictMarks(data: FormData) {
  // Convert participation to numerical value
  const participationValue = data.participation === "high" ? 1.0 : data.participation === "medium" ? 0.7 : 0.4

  // Convert assignment completion to numerical value
  const assignmentValue = data.assignment === "yes" ? 1.0 : 0.6

  // Calculate average internal marks
  const avgInternalMarks = (data.subject1 + data.subject2 + data.subject3 + data.subject4) / 4

  // Normalize to 0-1 scale
  const normalizedAttendance = data.attendance / 100
  const normalizedInternalMarks = avgInternalMarks / 60
  const normalizedInterest = data.interest / 100

  // Weights for different factors (sum to 1)
  const weights = {
    attendance: 0.15,
    participation: 0.1,
    assignment: 0.1,
    previousCGPA: 0.25,
    internalMarks: 0.3,
    interest: 0.1,
  }

  // Calculate weighted score (0-1 scale)
  const weightedScore =
    weights.attendance * normalizedAttendance +
    weights.participation * participationValue +
    weights.assignment * assignmentValue +
    weights.previousCGPA * (data.previousCGPA / 10) +
    weights.internalMarks * normalizedInternalMarks +
    weights.interest * normalizedInterest

  // Convert to CGPA scale (0-10)
  const predictedCGPA = weightedScore * 10

  // Find the weakest subject
  const subjects = [
    { num: 1, value: data.subject1 },
    { num: 2, value: data.subject2 },
    { num: 3, value: data.subject3 },
    { num: 4, value: data.subject4 },
  ]

  subjects.sort((a, b) => a.value - b.value)
  const weakSubject = subjects[0].num

  // Generate a message based on the prediction
  let message = ""

  if (predictedCGPA >= 8.5) {
    message = "Excellent! You're on track for outstanding results. Keep up the great work!"
  } else if (predictedCGPA >= 7.5) {
    message = "Very good! You're performing well. With a bit more effort, you could achieve excellence."
  } else if (predictedCGPA >= 6.5) {
    message = "Good performance. There's room for improvement, especially in your weaker subjects."
  } else if (predictedCGPA >= 5.5) {
    message = "You're doing okay, but should focus on improving your attendance and internal marks."
  } else {
    message =
      "You need to significantly improve your academic performance. Focus on regular attendance and completing assignments on time."
  }

  return {
    cgpa: predictedCGPA,
    message,
    weakSubject: subjects[0].value < 45 ? weakSubject : 0,
  }
}
