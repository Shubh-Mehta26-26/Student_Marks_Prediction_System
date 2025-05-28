import Database from "better-sqlite3"
import path from "path"

// This is a singleton to ensure we only open the database once
let db: any = null

async function openDb() {
  if (!db) {
    db = new Database(path.join(process.cwd(), "database.db"))

    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        attendance REAL,
        participation INTEGER,
        assignment BOOLEAN,
        prev_cgpa REAL,
        interest REAL,
        subject1_name TEXT,
        subject1_marks REAL,
        subject2_name TEXT,
        subject2_marks REAL,
        subject3_name TEXT,
        subject3_marks REAL,
        subject4_name TEXT,
        subject4_marks REAL,
        subject5_name TEXT,
        subject5_marks REAL,
        practical1_name TEXT,
        practical1_marks REAL,
        practical2_name TEXT,
        practical2_marks REAL,
        practical3_name TEXT,
        practical3_marks REAL,
        predicted_cgpa REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      );
      
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        prediction_id INTEGER,
        rating INTEGER,
        sentiment TEXT,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (prediction_id) REFERENCES predictions(id)
      );
    `)
  }

  return db
}

export async function getDb() {
  return openDb()
}

// User functions
export async function createUser(username: string, email: string, password: string, role = "student") {
  const db = await openDb()
  try {
    const result = db.prepare("INSERT INTO students (username, email, password, role) VALUES (?, ?, ?, ?)").run(
      username,
      email,
      password,
      role,
    )
    return { id: result.lastInsertRowid }
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      if (error.message.includes("username")) {
        throw new Error("Username already exists")
      } else if (error.message.includes("email")) {
        throw new Error("Email already exists")
      }
    }
    throw error
  }
}

export async function getUserByEmail(email: string) {
  const db = await openDb()
  return db.prepare("SELECT * FROM students WHERE email = ?").get(email)
}

export async function getUserById(id: number) {
  const db = await openDb()
  return db.prepare("SELECT * FROM students WHERE id = ?").get(id)
}

// Prediction functions
export async function savePrediction(data: any) {
  const db = await openDb()
  const result = db.prepare(
    `INSERT INTO predictions (
      student_id, attendance, participation, assignment, prev_cgpa, interest,
      subject1_name, subject1_marks, subject2_name, subject2_marks, subject3_name, subject3_marks,
      subject4_name, subject4_marks, subject5_name, subject5_marks,
      practical1_name, practical1_marks, practical2_name, practical2_marks, practical3_name, practical3_marks,
      predicted_cgpa
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    data.studentId,
    data.attendance,
    data.participation,
    data.assignment ? 1 : 0,
    data.previousCGPA,
    data.interest,
    data.subjects[0]?.name || null,
    data.subjects[0]?.marks || null,
    data.subjects[1]?.name || null,
    data.subjects[1]?.marks || null,
    data.subjects[2]?.name || null,
    data.subjects[2]?.marks || null,
    data.subjects[3]?.name || null,
    data.subjects[3]?.marks || null,
    data.subjects[4]?.name || null,
    data.subjects[4]?.marks || null,
    data.practicalSubjects[0]?.name || null,
    data.practicalSubjects[0]?.marks || null,
    data.practicalSubjects[1]?.name || null,
    data.practicalSubjects[1]?.marks || null,
    data.practicalSubjects[2]?.name || null,
    data.practicalSubjects[2]?.marks || null,
    data.predictedCGPA,
  )
  return { id: result.lastInsertRowid }
}

export async function getPredictionsByStudentId(studentId: number) {
  const db = await openDb()
  return db.prepare("SELECT * FROM predictions WHERE student_id = ? ORDER BY created_at DESC").all(studentId)
}

export async function getAllPredictions() {
  const db = await openDb()
  return db.prepare(`
    SELECT p.*, s.username, s.email 
    FROM predictions p
    JOIN students s ON p.student_id = s.id
    ORDER BY p.created_at DESC
  `).all()
}

// Feedback functions
export async function saveFeedback(data: any) {
  const db = await openDb()
  const result = db.prepare(
    `INSERT INTO feedback (
      student_id, prediction_id, rating, sentiment, comment, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    data.studentId,
    data.predictionId,
    data.rating,
    data.sentiment,
    data.comment,
    data.timestamp
  )
  return { id: result.lastInsertRowid }
}

export async function getFeedbackByStudentId(studentId: number) {
  const db = await openDb()
  return db.prepare(
    `
    SELECT f.*, p.predicted_cgpa, s.username
    FROM feedback f
    JOIN predictions p ON f.prediction_id = p.id
    JOIN students s ON f.student_id = s.id
    WHERE f.student_id = ?
    ORDER BY f.created_at DESC
  `
  ).all(studentId)
}

export async function getFeedbackByPredictionId(predictionId: number) {
  const db = await openDb()
  return db.prepare(
    `
    SELECT f.*, s.username
    FROM feedback f
    JOIN students s ON f.student_id = s.id
    WHERE f.prediction_id = ?
    ORDER BY f.created_at DESC
  `
  ).all(predictionId)
}

export async function getAllFeedback() {
  const db = await openDb()
  return db.prepare(`
    SELECT f.*, s.username, p.predicted_cgpa
    FROM feedback f
    JOIN students s ON f.student_id = s.id
    JOIN predictions p ON f.prediction_id = p.id
    ORDER BY f.created_at DESC
  `).all()
}

export async function getAllUsers() {
  const db = await openDb()
  return db.prepare("SELECT * FROM students ORDER BY created_at DESC").all()
}

export async function deleteUser(id: number) {
  const db = await openDb()
  return db.prepare("DELETE FROM students WHERE id = ?").run(id)
}
