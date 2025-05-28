"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { BarChart, BookOpen, Home, LogIn, LogOut, Menu, ThumbsUp, User, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/predict", label: "Predict", icon: <BarChart className="h-5 w-5" />, authRequired: true },
    { href: "/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5" />, authRequired: true },
    { href: "/study-plan", label: "Study Plan", icon: <BookOpen className="h-5 w-5" />, authRequired: true },
    { href: "/feedback", label: "Feedback", icon: <ThumbsUp className="h-5 w-5" />, authRequired: true },
  ]

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-white font-bold text-xl">StudyPredict</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => {
                if (link.authRequired && !isAuthenticated) return null
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className={`flex items-center ${
                        pathname === link.href
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "text-purple-200 hover:bg-purple-900/50 hover:text-white"
                      }`}
                    >
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-purple-200 hover:bg-purple-900/50 hover:text-white"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-purple-200 hover:bg-purple-900/50 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                  <div className="flex items-center space-x-2 text-purple-200 px-3 py-1 rounded-full bg-purple-900/50">
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className={`text-purple-200 hover:bg-purple-900/50 hover:text-white ${
                        pathname === "/login" ? "bg-purple-600 text-white hover:bg-purple-700" : ""
                      }`}
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      className={`bg-purple-600 hover:bg-purple-700 text-white ${
                        pathname === "/register" ? "bg-purple-700" : ""
                      }`}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-purple-200 hover:bg-purple-900/50 hover:text-white mr-2"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              className="text-purple-200 hover:bg-purple-900/50 hover:text-white"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/60 backdrop-blur-md border-b border-purple-500/20"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => {
                if (link.authRequired && !isAuthenticated) return null
                return (
                  <Link key={link.href} href={link.href} className="block">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        pathname === link.href
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "text-purple-200 hover:bg-purple-900/50 hover:text-white"
                      }`}
                    >
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </Button>
                  </Link>
                )
              })}

              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-purple-200 px-3 py-2 rounded-md bg-purple-900/50">
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-purple-200 hover:bg-purple-900/50 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-purple-200 hover:bg-purple-900/50 hover:text-white ${
                        pathname === "/login" ? "bg-purple-600 text-white hover:bg-purple-700" : ""
                      }`}
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button
                      className={`w-full justify-start bg-purple-600 hover:bg-purple-700 text-white ${
                        pathname === "/register" ? "bg-purple-700" : ""
                      }`}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
