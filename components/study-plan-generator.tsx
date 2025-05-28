"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { usePrediction } from "@/lib/prediction-context"
import {
  Clock,
  BookOpen,
  FileText,
  Video,
  Users,
  CheckCircle2,
  Download,
  Loader2,
  Brain,
  Lightbulb,
} from "lucide-react"

type StudySession = {
  id: string
  day: string
  timeSlot: string
  subject: string
  duration: number
  activityType: string
  resources: string[]
  completed: boolean
}

type WeeklyPlan = {
  id: string
  week: number
  startDate: string
  endDate: string
  sessions: StudySession[]
  weeklyGoals: string[]
  completionRate: number
}

export function StudyPlanGenerator() {
  const { predictions } = usePrediction()
  const { toast } = useToast()
  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null

  const [isGenerating, setIsGenerating] = useState(false)
  const [studyPlan, setStudyPlan] = useState<WeeklyPlan[]>([])
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(2)
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [learningStyle, setLearningStyle] = useState("visual")

  // Generate a personalized study plan based on student data
  const generateStudyPlan = () => {
    if (!latestPrediction) {
      toast({
        title: "No prediction data",
        description: "Please make a prediction first to generate a study plan.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // In a real application, this would call an API with ML model
    // For now, we'll simulate the generation with a timeout
    setTimeout(() => {
      // Get subjects from prediction data
      const subjects = latestPrediction.data.subjects.map((s) => s.name)

      // Find weakest subject
      const weakestSubject = latestPrediction.weakestSubject

      // Create a 4-week study plan
      const newStudyPlan: WeeklyPlan[] = []

      for (let week = 1; week <= 4; week++) {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + (week - 1) * 7)

        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 6)

        const sessions: StudySession[] = []

        // Generate study sessions for each day of the week
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        daysOfWeek.forEach((day, dayIndex) => {
          // Skip Sunday if the student prefers fewer study days
          if (day === "Sunday" && studyHoursPerDay <= 2) return

          // Determine which subject to focus on this day
          let subjectForDay = ""

          // Prioritize weakest subject more often
          if (dayIndex % 3 === 0 || dayIndex === 1) {
            subjectForDay = weakestSubject
          } else {
            // Rotate through other subjects
            const otherSubjects = subjects.filter((s) => s !== weakestSubject)
            subjectForDay = otherSubjects[dayIndex % otherSubjects.length]
          }

          // Morning session
          if (dayIndex !== 6) {
            // Not Sunday
            sessions.push({
              id: `week${week}-${day}-morning`,
              day,
              timeSlot: "Morning (8:00 - 10:00 AM)",
              subject: subjectForDay,
              duration: studyHoursPerDay,
              activityType: getActivityType(learningStyle, 0),
              resources: getResources(subjectForDay, learningStyle, 0),
              completed: false,
            })
          }

          // Evening session
          if (studyHoursPerDay >= 3 || dayIndex === 5) {
            // Saturday or if student wants more hours
            sessions.push({
              id: `week${week}-${day}-evening`,
              day,
              timeSlot: "Evening (6:00 - 8:00 PM)",
              subject: dayIndex === 5 ? "All Subjects" : subjects[(dayIndex + 2) % subjects.length],
              duration: studyHoursPerDay - 1,
              activityType: getActivityType(learningStyle, 1),
              resources: getResources(subjects[(dayIndex + 2) % subjects.length], learningStyle, 1),
              completed: false,
            })
          }
        })

        // Set weekly goals based on week number
        const weeklyGoals = getWeeklyGoals(week, weakestSubject)

        newStudyPlan.push({
          id: `week-${week}`,
          week,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          sessions,
          weeklyGoals,
          completionRate: 0,
        })
      }

      setStudyPlan(newStudyPlan)
      setSelectedWeek(0)
      setIsGenerating(false)

      toast({
        title: "Study Plan Generated",
        description: "Your personalized 4-week study plan is ready!",
        variant: "default",
      })
    }, 2000)
  }

  // Helper function to get activity type based on learning style
  const getActivityType = (style: string, variant: number): string => {
    const activities = {
      visual: ["Watch video lectures", "Create mind maps", "Review diagrams and charts", "Visual note-taking"],
      auditory: ["Listen to recorded lectures", "Group discussion", "Verbal summarization", "Audio note review"],
      reading: ["Read textbook chapters", "Summarize key concepts", "Review lecture notes", "Practice with textbooks"],
      kinesthetic: ["Hands-on practice", "Lab experiments", "Interactive simulations", "Teaching concepts to others"],
    }

    const styleActivities = activities[style as keyof typeof activities] || activities.visual
    return styleActivities[variant % styleActivities.length]
  }

  // Helper function to get resources based on subject and learning style
  const getResources = (subject: string, style: string, variant: number): string[] => {
    const baseResources = [`${subject} lecture notes`, `${subject} practice problems`]

    const styleResources = {
      visual: [
        `${subject} video tutorials on YouTube`,
        `${subject} visual concept maps`,
        `${subject} illustrated guides`,
      ],
      auditory: [`${subject} podcast lectures`, `${subject} audio summaries`, `${subject} discussion recordings`],
      reading: [`${subject} textbook chapters 1-3`, `${subject} academic papers`, `${subject} study guides`],
      kinesthetic: [`${subject} interactive simulations`, `${subject} lab exercises`, `${subject} practice worksheets`],
    }

    const additionalResources = styleResources[style as keyof typeof styleResources] || styleResources.visual
    return [...baseResources, additionalResources[variant % additionalResources.length]]
  }

  // Helper function to get weekly goals
  const getWeeklyGoals = (week: number, weakestSubject: string): string[] => {
    switch (week) {
      case 1:
        return [
          `Review fundamentals of ${weakestSubject}`,
          "Complete all pending assignments",
          "Create a concept map of key topics",
        ]
      case 2:
        return [
          `Master difficult concepts in ${weakestSubject}`,
          "Complete 20 practice problems",
          "Prepare summary notes for quick revision",
        ]
      case 3:
        return [
          "Take practice tests for all subjects",
          `Focus on advanced topics in ${weakestSubject}`,
          "Review and correct mistakes from practice tests",
        ]
      case 4:
        return ["Final revision of all subjects", "Mock exam simulation", "Focus on time management strategies"]
      default:
        return ["Review course material", "Complete practice problems", "Prepare for assessments"]
    }
  }

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Toggle completion status of a study session
  const toggleSessionCompletion = (weekIndex: number, sessionId: string) => {
    const updatedPlan = [...studyPlan]
    const week = updatedPlan[weekIndex]

    const sessionIndex = week.sessions.findIndex((s) => s.id === sessionId)
    if (sessionIndex !== -1) {
      week.sessions[sessionIndex].completed = !week.sessions[sessionIndex].completed

      // Update completion rate
      const completedSessions = week.sessions.filter((s) => s.completed).length
      week.completionRate = (completedSessions / week.sessions.length) * 100

      setStudyPlan(updatedPlan)
    }
  }

  // Download study plan as PDF
  const downloadStudyPlan = () => {
    toast({
      title: "Downloading Study Plan",
      description: "Your study plan is being prepared for download...",
    })

    // In a real application, this would generate a PDF
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your study plan has been downloaded successfully.",
        variant: "default",
      })
    }, 1500)
  }

  return (
    <GlassmorphicCard>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-400" />
          Personalized Study Plan Generator
        </CardTitle>
      </CardHeader>

      {studyPlan.length === 0 ? (
        <CardContent>
          <div className="space-y-6">
            <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                How It Works
              </h3>
              <p className="text-purple-200 mb-4">
                Our AI will analyze your academic performance data and create a personalized study plan tailored to your
                needs. The plan includes:
              </p>
              <ul className="space-y-2 text-purple-200">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 mt-1" />
                  <span>Daily study sessions with recommended subjects and activities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 mt-1" />
                  <span>Weekly goals to track your progress</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 mt-1" />
                  <span>Customized resources based on your learning style</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 mt-1" />
                  <span>Extra focus on your weakest subjects</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Customize Your Plan</h3>

              <div>
                <Label htmlFor="studyHours" className="text-purple-100">
                  Study Hours Per Day: {studyHoursPerDay}
                </Label>
                <Slider
                  id="studyHours"
                  min={1}
                  max={4}
                  step={1}
                  value={[studyHoursPerDay]}
                  onValueChange={(value) => setStudyHoursPerDay(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-purple-300">
                  <span>1 hr (Minimal)</span>
                  <span>2-3 hrs (Moderate)</span>
                  <span>4 hrs (Intensive)</span>
                </div>
              </div>

              <div>
                <Label className="text-purple-100 block mb-2">Learning Style Preference</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["visual", "auditory", "reading", "kinesthetic"].map((style) => (
                    <div
                      key={style}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        learningStyle === style
                          ? "bg-purple-600/50 border-purple-500"
                          : "bg-purple-900/30 border-purple-500/30 hover:bg-purple-900/50"
                      }`}
                      onClick={() => setLearningStyle(style)}
                    >
                      <div className="text-center">
                        {style === "visual" && <Video className="h-5 w-5 mx-auto mb-1 text-purple-400" />}
                        {style === "auditory" && <Users className="h-5 w-5 mx-auto mb-1 text-purple-400" />}
                        {style === "reading" && <BookOpen className="h-5 w-5 mx-auto mb-1 text-purple-400" />}
                        {style === "kinesthetic" && <FileText className="h-5 w-5 mx-auto mb-1 text-purple-400" />}
                        <span className="text-sm capitalize text-white">{style}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {latestPrediction?.data.subjects && (
                <div>
                  <Label className="text-purple-100 block mb-2">Focus Areas (Optional)</Label>
                  <div className="space-y-2">
                    {latestPrediction.data.subjects.map((subject) => (
                      <div key={subject.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`focus-${subject.name}`}
                          checked={focusAreas.includes(subject.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFocusAreas([...focusAreas, subject.name])
                            } else {
                              setFocusAreas(focusAreas.filter((area) => area !== subject.name))
                            }
                          }}
                        />
                        <Label htmlFor={`focus-${subject.name}`} className="text-purple-100">
                          {subject.name}
                          {subject.name === latestPrediction.weakestSubject && (
                            <span className="ml-2 text-xs text-amber-400">(Recommended)</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-0">
          <Tabs defaultValue={`week-${studyPlan[selectedWeek].week}`} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-4 w-full bg-black/40 border border-purple-500/20">
                {studyPlan.map((week, index) => (
                  <TabsTrigger
                    key={week.id}
                    value={week.id}
                    onClick={() => setSelectedWeek(index)}
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Week {week.week}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {studyPlan.map((week, weekIndex) => (
              <TabsContent key={week.id} value={week.id} className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Week {week.week} Plan</h3>
                    <p className="text-sm text-purple-300">
                      {week.startDate} - {week.endDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-full md:w-auto flex items-center gap-2">
                      <div className="bg-purple-900/50 px-3 py-1 rounded-md">
                        <span className="text-sm font-medium text-white">
                          {Math.round(week.completionRate)}% Complete
                        </span>
                      </div>
                      <Progress value={week.completionRate} className="h-2 w-24" />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Weekly Goals</h4>
                  <ul className="space-y-1">
                    {week.weeklyGoals.map((goal, index) => (
                      <li key={index} className="flex items-start gap-2 text-purple-200">
                        <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-900 text-purple-300 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Study Sessions</h4>

                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                    const daySessions = week.sessions.filter((session) => session.day === day)

                    if (daySessions.length === 0) return null

                    return (
                      <div
                        key={day}
                        className="bg-purple-900/20 border border-purple-500/20 rounded-lg overflow-hidden"
                      >
                        <div className="bg-purple-900/40 px-4 py-2 border-b border-purple-500/20">
                          <h5 className="font-medium text-white">{day}</h5>
                        </div>

                        <div className="divide-y divide-purple-500/10">
                          {daySessions.map((session) => (
                            <div key={session.id} className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Clock className="h-4 w-4 text-purple-400" />
                                    <span className="text-sm text-purple-300">{session.timeSlot}</span>
                                  </div>

                                  <h6 className="font-medium text-white mb-1">
                                    {session.subject} - {session.activityType}
                                  </h6>

                                  <div className="text-sm text-purple-200">
                                    <span className="text-purple-400">Duration:</span> {session.duration} hour
                                    {session.duration > 1 ? "s" : ""}
                                  </div>

                                  <div className="mt-2">
                                    <h6 className="text-sm font-medium text-purple-300 mb-1">Resources:</h6>
                                    <ul className="list-disc list-inside text-sm text-purple-200 space-y-0.5">
                                      {session.resources.map((resource, i) => (
                                        <li key={i}>{resource}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={session.id}
                                      checked={session.completed}
                                      onCheckedChange={() => toggleSessionCompletion(weekIndex, session.id)}
                                    />
                                    <Label htmlFor={session.id} className="text-purple-100">
                                      {session.completed ? "Completed" : "Mark as complete"}
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      )}

      <CardFooter className="flex flex-col sm:flex-row gap-3">
        {studyPlan.length === 0 ? (
          <Button
            onClick={generateStudyPlan}
            disabled={isGenerating || !latestPrediction}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              "Generate Personalized Study Plan"
            )}
          </Button>
        ) : (
          <>
            <Button onClick={downloadStudyPlan} className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Download className="mr-2 h-4 w-4" />
              Download Study Plan
            </Button>
            <Button
              onClick={() => setStudyPlan([])}
              variant="outline"
              className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
            >
              Create New Plan
            </Button>
          </>
        )}
      </CardFooter>
    </GlassmorphicCard>
  )
}
