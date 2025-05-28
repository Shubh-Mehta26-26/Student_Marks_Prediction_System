"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { TiltCard } from "@/components/tilt-card"
import { FloatingParticles } from "@/components/floating-particles"
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { toast } = useToast()
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await register(formData.name, formData.email, formData.password)
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
        variant: "default",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = () => {
    const password = formData.password
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength()
    if (strength < 50) return "bg-red-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0">
        <FloatingParticles />
      </div>

      <div className="w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white">Create Account</h1>
          <p className="mt-3 text-purple-200">Join our AI-powered academic prediction platform</p>
        </motion.div>

        <TiltCard>
          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              {step === 1 ? (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Label htmlFor="name" className="text-purple-100 text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-purple-950/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Student Name"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Label htmlFor="email" className="text-purple-100 text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-purple-950/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="student@example.com"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Label htmlFor="studentId" className="text-purple-100 text-sm font-medium">
                      Student ID
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="studentId"
                        name="studentId"
                        type="text"
                        required
                        value={formData.studentId}
                        onChange={handleChange}
                        className="bg-purple-950/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="ST12345"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Continue
                    </Button>
                  </motion.div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Label htmlFor="password" className="text-purple-100 text-sm font-medium">
                      Password
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-purple-950/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:ring-purple-500 focus:border-purple-500 pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-purple-100"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="h-1 w-full bg-gray-700 rounded">
                        <div
                          className={`h-1 ${getPasswordStrengthColor()} rounded`}
                          style={{ width: `${passwordStrength()}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-purple-300 mt-1">
                        {passwordStrength() < 50 && "Weak password"}
                        {passwordStrength() >= 50 && passwordStrength() < 75 && "Medium password"}
                        {passwordStrength() >= 75 && "Strong password"}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Label htmlFor="confirmPassword" className="text-purple-100 text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="bg-purple-950/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="••••••••"
                      />
                    </div>
                    {formData.password && formData.confirmPassword && (
                      <div className="mt-2 flex items-center">
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                            <p className="text-xs text-green-500">Passwords match</p>
                          </>
                        ) : (
                          <p className="text-xs text-red-500">Passwords don't match</p>
                        )}
                      </div>
                    )}
                  </motion.div>

                  <div className="flex space-x-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="w-1/2"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
                      >
                        Back
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="w-1/2"
                    >
                      <Button
                        type="submit"
                        disabled={isLoading || formData.password !== formData.confirmPassword}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-purple-200">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>
          </Card>
        </TiltCard>
      </div>
    </div>
  )
}
