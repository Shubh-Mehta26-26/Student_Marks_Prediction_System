"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FloatingParticles } from "@/components/floating-particles"
import { TiltCard } from "@/components/tilt-card"
import { StudyPlanGenerator } from "@/components/study-plan-generator"
import { useAuth } from "@/lib/auth-context"
import { usePrediction } from "@/lib/prediction-context"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function StudyPlanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const { predictions } = usePrediction()
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      })
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, router, toast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-200 text-lg">Loading study plan generator...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0">
        <FloatingParticles />
      </div>

      <div className="container mx-auto max-w-5xl z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white">Personalized Study Plan</h1>
          <p className="mt-3 text-purple-200">
            Create a customized study schedule based on your academic performance and learning style
          </p>
        </motion.div>

        {predictions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Alert className="mb-8 bg-red-900/30 border-red-500/30 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No prediction data</AlertTitle>
              <AlertDescription>
                You need to make a prediction first before generating a personalized study plan.
              </AlertDescription>
            </Alert>

            <TiltCard>
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-purple-200 mb-6">
                    To generate a personalized study plan, we need to analyze your academic data. Please make a
                    prediction first.
                  </p>
                  <Link href="/predict">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Make a Prediction
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <StudyPlanGenerator />
          </motion.div>
        )}
      </div>
    </div>
  )
}
