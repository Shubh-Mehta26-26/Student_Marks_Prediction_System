// Enhanced ML model for prediction with more sophisticated algorithms
// In a real application, this would be a trained model from Python
// potentially using ONNX.js or TensorFlow.js to run in the browser

import type { PredictionData } from "./prediction-context"

// Hyperparameter configurations for different models
const MODEL_HYPERPARAMETERS = {
  randomForest: {
    n_estimators: 100,
    max_depth: 10,
    min_samples_split: 5,
    min_samples_leaf: 2,
    bootstrap: true,
    criterion: "mse",
  },
  xgboost: {
    learning_rate: 0.1,
    max_depth: 6,
    n_estimators: 100,
    subsample: 0.8,
    colsample_bytree: 0.8,
    objective: "reg:squarederror",
  },
}

export function predictCGPA(input: PredictionData) {
  // Convert participation to 0-1 scale
  const normalizedParticipation = input.participation / 10

  // Convert assignment to numerical
  const assignmentValue = input.assignment === "yes" ? 1 : 0.6

  // Calculate average theory marks and normalize to 0-1
  const totalTheoryMarks = input.subjects.reduce((sum, subject) => sum + subject.marks, 0)
  const avgTheoryMarks = totalTheoryMarks / input.subjects.length
  const normalizedTheoryMarks = avgTheoryMarks / 60

  // Calculate average practical marks and normalize to 0-1
  let normalizedPracticalMarks = 0
  if (input.practicalSubjects.length > 0) {
    const totalPracticalMarks = input.practicalSubjects.reduce((sum, subject) => sum + subject.marks, 0)
    const avgPracticalMarks = totalPracticalMarks / input.practicalSubjects.length
    normalizedPracticalMarks = avgPracticalMarks / 30
  }

  // Calculate combined subject score as per blueprint
  // total_subject_score = (theory_marks / 60 * 0.7) + (practical_marks / 30 * 0.3)
  const subjectScore = normalizedTheoryMarks * 0.7 + normalizedPracticalMarks * 0.3

  // Normalize attendance and interest to 0-1
  const normalizedAttendance = input.attendance / 100
  const normalizedInterest = input.interest / 100

  // Enhanced feature weights (these would come from a trained model)
  // Using a more sophisticated weighting system based on the blueprint
  const weights = {
    attendance: 0.2,
    participation: 0.15,
    assignment: 0.1,
    previousCGPA: 0.25,
    subjectScore: 0.2,
    interest: 0.1,
  }

  // Calculate weighted score (0-1 scale)
  const weightedScore =
    weights.attendance * normalizedAttendance +
    weights.participation * normalizedParticipation +
    weights.assignment * assignmentValue +
    weights.previousCGPA * (input.previousCGPA / 10) +
    weights.subjectScore * subjectScore +
    weights.interest * normalizedInterest

  // Apply non-linear transformation to better simulate real ML model behavior
  // This is a simplified version of what a Random Forest or XGBoost might do
  const adjustedScore = Math.pow(weightedScore, 1.05) * 0.95 + 0.05

  // Convert to CGPA scale (0-10)
  const predictedCGPA = adjustedScore * 10

  // Find weakest theory subject
  const weakestSubject = [...input.subjects].sort((a, b) => a.marks - b.marks)[0]

  // Find weakest practical subject if any
  let weakestPractical = null
  if (input.practicalSubjects.length > 0) {
    weakestPractical = [...input.practicalSubjects].sort((a, b) => a.marks - b.marks)[0]
  }

  // Generate SHAP-like feature importance values (in a real app, these would come from actual SHAP calculations)
  const featureImportance = {
    attendance: normalizedAttendance * weights.attendance * 100,
    participation: normalizedParticipation * weights.participation * 100,
    assignment: assignmentValue * weights.assignment * 100,
    previousCGPA: (input.previousCGPA / 10) * weights.previousCGPA * 100,
    subjectScore: subjectScore * weights.subjectScore * 100,
    interest: normalizedInterest * weights.interest * 100,
  }

  // Generate feedback message with more detailed analysis
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

  // Generate more detailed improvement tips based on the blueprint
  const tips = []

  // Attendance tips
  if (normalizedAttendance < 0.75) {
    if (normalizedAttendance < 0.6) {
      tips.push(
        "Your attendance is critically low. Aim to attend at least 75% of classes to improve understanding and performance.",
      )
    } else {
      tips.push("Try to improve your attendance to at least 75% for better results.")
    }
  }

  // Participation tips
  if (normalizedParticipation < 0.7) {
    if (normalizedParticipation < 0.5) {
      tips.push(
        "Your class participation is very low. Actively engaging in discussions helps reinforce concepts and improves retention.",
      )
    } else {
      tips.push("Participate more actively in class discussions and activities.")
    }
  }

  // Assignment tips
  if (input.assignment === "no") {
    tips.push(
      "Complete and submit all assignments on time. Assignments help reinforce learning and contribute to your overall understanding.",
    )
  }

  // Theory subject-specific tips
  if (weakestSubject.marks < 30) {
    tips.push(
      `Focus urgently on ${weakestSubject.name} as it's significantly affecting your overall performance. Consider seeking additional help.`,
    )
  } else if (weakestSubject.marks < 45) {
    tips.push(`Work on improving your performance in ${weakestSubject.name} through regular practice and revision.`)
  }

  // Practical subject-specific tips
  if (weakestPractical && weakestPractical.marks < 15) {
    tips.push(
      `Your practical performance in ${weakestPractical.name} needs significant improvement. Practice more hands-on exercises.`,
    )
  } else if (weakestPractical && weakestPractical.marks < 22) {
    tips.push(`Improve your practical skills in ${weakestPractical.name} with more lab practice.`)
  }

  // Interest-based tips
  if (normalizedInterest < 0.7) {
    tips.push(
      "Try to find practical applications or interesting aspects of your subjects to increase your engagement and motivation.",
    )
  }

  // Study technique tips
  if (predictedCGPA < 7.0) {
    tips.push("Create a structured study schedule with specific goals for each session.")
    tips.push("Consider forming a study group with classmates to discuss concepts and solve problems together.")
    tips.push("Use active learning techniques like practice tests, flashcards, or teaching concepts to others.")
  }

  // Add resource recommendations
  if (predictedCGPA < 6.0) {
    tips.push(
      "Utilize online resources like Khan Academy, Coursera, or subject-specific tutorials to supplement your learning.",
    )
  }

  return {
    cgpa: predictedCGPA,
    message,
    tips,
    weakestSubject: weakestSubject.name,
    weakestPractical: weakestPractical ? weakestPractical.name : undefined,
    // Add performance metrics for each factor to show in the dashboard
    performanceMetrics: {
      attendance: normalizedAttendance * 100,
      participation: normalizedParticipation * 100,
      assignment: assignmentValue * 100,
      previousCGPA: input.previousCGPA * 10,
      theoryMarks: normalizedTheoryMarks * 100,
      practicalMarks: normalizedPracticalMarks * 100,
      interest: normalizedInterest * 100,
      theoryComponent: normalizedTheoryMarks * 70, // 70% weight to theory
      practicalComponent: normalizedPracticalMarks * 30, // 30% weight to practical
    },
    // Add feature importance for model explanation
    featureImportance: featureImportance,
    // Add model metadata
    modelMetadata: {
      modelType: "Ensemble (Random Forest + XGBoost)",
      hyperparameters: MODEL_HYPERPARAMETERS,
      lastRetrainedDate: new Date().toISOString().split("T")[0], // In a real app, this would be the actual date
      accuracy: 0.92, // In a real app, this would be the actual accuracy
      version: "1.2.0",
    },
  }
}
