import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string) {
  return hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export function generateToken(payload: any) {
  return sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function setAuthCookie(token: string) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function getAuthCookie() {
  return cookies().get("auth_token")?.value
}

export function removeAuthCookie() {
  cookies().delete("auth_token")
}

export async function getCurrentUser() {
  const token = getAuthCookie()
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  return decoded
}
