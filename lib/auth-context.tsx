"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: number
  username: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with the server
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would call the API
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: 1,
        username: email.split("@")[0],
        email,
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Login failed")
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      // In a real app, this would call the API
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: 1,
        username,
        email,
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Registration error:", error)
      throw new Error("Registration failed")
    }
  }

  const logout = async () => {
    try {
      // In a real app, this would call the API
      // Remove user from localStorage
      localStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw new Error("Logout failed")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
