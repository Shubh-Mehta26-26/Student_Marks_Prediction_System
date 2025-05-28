"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfessionalCard } from "@/components/professional-card"
import { FloatingParticles } from "@/components/floating-particles"
import { FeedbackForm } from "@/components/feedback-system/feedback-form"
import { FeedbackStats } from "@/components/feedback-system/feedback-stats"
import { FeedbackComments } from "@/components/feedback-system/feedback-comments"
import { FeedbackAnalytics } from "@/components/feedback-system/feedback-analytics"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { usePrediction } from "@/lib/prediction-context"
import { MessageSquare, ThumbsUp, LineChart, PieChart } from "lucide-react"

export default function FeedbackPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()
  const { predictions } = usePrediction()
  const [loading, setLoading] = useState(true)

  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null

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
          <p className="mt-4 text-purple-200 text-lg">Loading feedback system...</p>
        </div>
      </div>
    )
  }

  if (!latestPrediction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 z-0">
          <FloatingParticles />
        </div>

        <div className="container mx-auto max-w-4xl z-10 relative">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white">Feedback System</h1>
            <p className="mt-3 text-purple-200">Share your thoughts about our prediction system</p>
          </div>

          <ProfessionalCard>
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">No Predictions Found</h2>
                <p className="text-purple-200 mb-6">You need to make a prediction before you can provide feedback.</p>
                <Button
                  onClick={() => router.push("/predict")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Make a Prediction
                </Button>
              </CardContent>
            </Card>
          </ProfessionalCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0">
        <FloatingParticles />
      </div>

      <div className="container mx-auto max-w-6xl z-10 relative">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">Feedback System</h1>
          <p className="mt-3 text-purple-200">Share your thoughts about our prediction system</p>
        </div>

        <Tabs defaultValue="submit" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto bg-black/40 border border-purple-500/20">
            <TabsTrigger value="submit" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Submit
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <PieChart className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <LineChart className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ProfessionalCard>
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Your Latest Prediction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-2">Predicted CGPA</h3>
                          <div className="text-3xl font-bold text-purple-400">{latestPrediction.cgpa.toFixed(2)}</div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-white mb-2">Performance Analysis</h3>
                          <p className="text-purple-200">{latestPrediction.message}</p>
                        </div>

                        {latestPrediction.weakestSubject && (
                          <div>
                            <h3 className="text-lg font-medium text-white mb-2">Areas for Improvement</h3>
                            <p className="text-purple-200">
                              Your weakest subject appears to be{" "}
                              <span className="font-semibold">{latestPrediction.weakestSubject}</span>.
                              {latestPrediction.weakestPractical && (
                                <>
                                  {" "}
                                  And your weakest practical is{" "}
                                  <span className="font-semibold">{latestPrediction.weakestPractical}</span>.
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </ProfessionalCard>
              </div>

              <div>
                <ProfessionalCard>
                  <FeedbackForm />
                </ProfessionalCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-8">
            <ProfessionalCard>
              <FeedbackStats />
            </ProfessionalCard>
          </TabsContent>

          <TabsContent value="trends" className="space-y-8">
            <ProfessionalCard>
              <FeedbackAnalytics />
            </ProfessionalCard>
          </TabsContent>

          <TabsContent value="comments" className="space-y-8">
            <ProfessionalCard>
              <FeedbackComments />
            </ProfessionalCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
