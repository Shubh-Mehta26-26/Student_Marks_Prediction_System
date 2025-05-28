"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { usePrediction } from "@/lib/prediction-context"
import { Target, Award, TrendingUp, AlertTriangle } from "lucide-react"

export function GoalSetting() {
  const { predictions } = usePrediction()
  const { toast } = useToast()
  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null

  const [goalCGPA, setGoalCGPA] = useState<number>(
    latestPrediction ? Math.min(10, Math.round((latestPrediction.cgpa + 1) * 10) / 10) : 8.0,
  )
  const [isEditing, setIsEditing] = useState(false)
  const [tempGoal, setTempGoal] = useState<string>(goalCGPA.toString())

  const handleSaveGoal = () => {
    const newGoal = Number.parseFloat(tempGoal)
    if (isNaN(newGoal) || newGoal < 0 || newGoal > 10) {
      toast({
        title: "Invalid Goal",
        description: "Please enter a valid CGPA goal between 0 and 10.",
        variant: "destructive",
      })
      return
    }

    setGoalCGPA(newGoal)
    setIsEditing(false)

    toast({
      title: "Goal Updated",
      description: `Your CGPA goal has been set to ${newGoal.toFixed(1)}.`,
      variant: "default",
    })
  }

  const calculateProgress = () => {
    if (!latestPrediction) return 0

    // Calculate progress as percentage of goal achieved
    const progress = (latestPrediction.cgpa / goalCGPA) * 100
    return Math.min(100, progress) // Cap at 100%
  }

  const getGapAnalysis = () => {
    if (!latestPrediction) return null

    const gap = goalCGPA - latestPrediction.cgpa

    if (gap <= 0) {
      return {
        message: "Congratulations! You've already achieved or exceeded your goal.",
        color: "text-green-500",
        icon: <Award className="h-5 w-5" />,
      }
    } else if (gap < 0.5) {
      return {
        message: "You're very close to your goal! Just a little more effort needed.",
        color: "text-blue-500",
        icon: <TrendingUp className="h-5 w-5" />,
      }
    } else if (gap < 1.5) {
      return {
        message: "You're making progress toward your goal. Keep improving consistently.",
        color: "text-yellow-500",
        icon: <Target className="h-5 w-5" />,
      }
    } else {
      return {
        message: "There's a significant gap to your goal. Focus on the improvement tips provided.",
        color: "text-red-500",
        icon: <AlertTriangle className="h-5 w-5" />,
      }
    }
  }

  const gapAnalysis = getGapAnalysis()
  const progress = calculateProgress()

  return (
    <GlassmorphicCard>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          CGPA Goal Setting
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!latestPrediction ? (
          <p className="text-purple-200 text-center py-4">Make a prediction first to set and track your CGPA goals.</p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Current vs Goal CGPA</h3>
                <p className="text-sm text-purple-300">
                  Your current predicted CGPA is{" "}
                  <span className="font-medium text-purple-400">{latestPrediction.cgpa.toFixed(1)}</span>
                </p>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="w-24 bg-purple-950/50 border-purple-500/30 text-white"
                  />
                  <Button size="sm" onClick={handleSaveGoal} className="bg-purple-600 hover:bg-purple-700">
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="bg-purple-900/50 px-3 py-1 rounded-md">
                    <span className="text-lg font-bold text-white">{goalCGPA.toFixed(1)}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTempGoal(goalCGPA.toString())
                      setIsEditing(true)
                    }}
                  >
                    Edit Goal
                  </Button>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-purple-300">Progress toward goal</span>
                <span className="text-sm font-medium text-white">{progress.toFixed(0)}%</span>
              </div>
              <Progress
                value={progress}
                className="h-2"
                indicatorClassName={
                  progress >= 90
                    ? "bg-green-500"
                    : progress >= 70
                      ? "bg-blue-500"
                      : progress >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                }
              />
            </div>

            {gapAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-2 p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 ${gapAnalysis.color}`}
              >
                {gapAnalysis.icon}
                <p className="text-sm">{gapAnalysis.message}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium text-white">Recommended Actions</h4>
              <ul className="space-y-1 text-sm text-purple-200">
                {latestPrediction.cgpa < goalCGPA ? (
                  <>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-900 text-purple-300 flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <span>Focus on improving your weakest subject: {latestPrediction.weakestSubject}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-900 text-purple-300 flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <span>Increase your attendance to at least 85% for better results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-900 text-purple-300 flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <span>Complete all assignments on time and participate actively in class</span>
                    </li>
                  </>
                ) : (
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-900 text-green-300 flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>You've already achieved your goal! Consider setting a more challenging target.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={!latestPrediction}
          onClick={() => {
            if (latestPrediction) {
              const newGoal = Math.min(10, Math.round((latestPrediction.cgpa + 0.5) * 10) / 10)
              setGoalCGPA(newGoal)
              toast({
                title: "Goal Automatically Updated",
                description: `Your CGPA goal has been set to ${newGoal.toFixed(1)}.`,
                variant: "default",
              })
            }
          }}
        >
          Set Recommended Goal
        </Button>
      </CardFooter>
    </GlassmorphicCard>
  )
}
