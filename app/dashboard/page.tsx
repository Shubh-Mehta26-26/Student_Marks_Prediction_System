"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfessionalCard } from "@/components/professional-card"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { FloatingParticles } from "@/components/floating-particles"
import { Badge3D } from "@/components/badge-3d"
import { AlertCircle, TrendingUp, BookOpen, Download, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { usePrediction } from "@/lib/prediction-context"
import { useToast } from "@/components/ui/use-toast"
import { GoalSetting } from "@/components/goal-setting"
import { PracticeGenerator } from "@/components/practice-generator"
import { generatePDF } from "@/lib/pdf-generator"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar, Pie, Radar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
)

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()
  const { predictions } = usePrediction()
  const [loading, setLoading] = useState(true)
  const [showPractice, setShowPractice] = useState(false)

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

  // Get the latest prediction
  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null

  // Determine if practice should be shown based on CGPA
  useEffect(() => {
    if (latestPrediction && latestPrediction.cgpa < 6.0) {
      setShowPractice(true)
    }
  }, [latestPrediction])

  // Format data for charts
  const cgpaChartData = {
    labels: predictions.map((p) => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: "CGPA",
        data: predictions.map((p) => p.cgpa),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const subjectChartData = latestPrediction
    ? {
        labels: latestPrediction.data.subjects.map((s) => s.name),
        datasets: [
          {
            label: "Theory Marks",
            data: latestPrediction.data.subjects.map((s) => s.marks),
            backgroundColor: ["#8b5cf6", "#6366f1", "#ec4899", "#f43f5e", "#10b981"],
            borderColor: ["#7c3aed", "#4f46e5", "#db2777", "#e11d48", "#059669"],
            borderWidth: 1,
          },
        ],
      }
    : null

  const practicalChartData = latestPrediction
    ? {
        labels: latestPrediction.data.practicalSubjects.map((s) => s.name),
        datasets: [
          {
            label: "Practical Marks",
            data: latestPrediction.data.practicalSubjects.map((s) => s.marks),
            backgroundColor: ["#8b5cf6", "#6366f1", "#ec4899"],
            borderColor: ["#7c3aed", "#4f46e5", "#db2777"],
            borderWidth: 1,
          },
        ],
      }
    : null

  const factorsData = latestPrediction
    ? {
        labels: ["Attendance", "Participation", "Interest", "Previous CGPA"],
        datasets: [
          {
            label: "Performance Factors",
            data: [
              latestPrediction.data.attendance,
              latestPrediction.data.participation * 10, // Scale to 0-100
              latestPrediction.data.interest,
              latestPrediction.data.previousCGPA * 10, // Scale to 0-100
            ],
            backgroundColor: [
              "rgba(139, 92, 246, 0.7)",
              "rgba(99, 102, 241, 0.7)",
              "rgba(236, 72, 153, 0.7)",
              "rgba(244, 63, 94, 0.7)",
            ],
            borderColor: ["#7c3aed", "#4f46e5", "#db2777", "#e11d48"],
            borderWidth: 1,
          },
        ],
      }
    : null

  // New radar chart for performance metrics
  const performanceRadarData = latestPrediction?.performanceMetrics
    ? {
        labels: ["Attendance", "Participation", "Assignment", "Previous CGPA", "Theory", "Practical", "Interest"],
        datasets: [
          {
            label: "Your Performance",
            data: [
              latestPrediction.performanceMetrics.attendance,
              latestPrediction.performanceMetrics.participation,
              latestPrediction.performanceMetrics.assignment,
              latestPrediction.performanceMetrics.previousCGPA,
              latestPrediction.performanceMetrics.theoryMarks,
              latestPrediction.performanceMetrics.practicalMarks,
              latestPrediction.performanceMetrics.interest,
            ],
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            borderColor: "#8b5cf6",
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#8b5cf6",
          },
          {
            label: "Target Performance",
            data: [80, 80, 100, 80, 80, 80, 80], // Target values for each metric
            backgroundColor: "rgba(74, 222, 128, 0.2)",
            borderColor: "#4ade80",
            pointBackgroundColor: "#4ade80",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#4ade80",
          },
        ],
      }
    : null

  // Theory vs Practical component chart
  const theoryVsPracticalData = latestPrediction?.performanceMetrics
    ? {
        labels: ["Theory Component", "Practical Component"],
        datasets: [
          {
            label: "Component Weight",
            data: [
              latestPrediction.performanceMetrics.theoryComponent,
              latestPrediction.performanceMetrics.practicalComponent,
            ],
            backgroundColor: ["rgba(139, 92, 246, 0.7)", "rgba(99, 102, 241, 0.7)"],
            borderColor: ["#7c3aed", "#4f46e5"],
            borderWidth: 1,
          },
        ],
      }
    : null

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 10,
        ticks: {
          color: "#a78bfa",
        },
        grid: {
          color: "rgba(167, 139, 250, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#a78bfa",
        },
        grid: {
          color: "rgba(167, 139, 250, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#a78bfa",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#a78bfa",
        },
        grid: {
          color: "rgba(167, 139, 250, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#a78bfa",
        },
        grid: {
          color: "rgba(167, 139, 250, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#a78bfa",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#a78bfa",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  }

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: "rgba(167, 139, 250, 0.2)",
        },
        grid: {
          color: "rgba(167, 139, 250, 0.2)",
        },
        pointLabels: {
          color: "#a78bfa",
        },
        ticks: {
          color: "#a78bfa",
          backdropColor: "transparent",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#a78bfa",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  }

  // Generate tips based on latest prediction
  const generateTips = () => {
    if (!latestPrediction) return []
    return latestPrediction.tips
  }

  const tips = generateTips()

  // Function to generate and download PDF report
  const downloadReport = () => {
    if (!latestPrediction || !user) return

    toast({
      title: "Generating Report",
      description: "Your performance report is being generated...",
    })

    try {
      // Generate PDF using jsPDF
      const doc = generatePDF(latestPrediction, user.username || "Student")

      // Save the PDF
      setTimeout(() => {
        doc.save(`performance_report_${new Date().toISOString().split("T")[0]}.pdf`)

        toast({
          title: "Report Ready",
          description: "Your performance report has been downloaded.",
          variant: "default",
        })
      }, 1000)
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-200 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0">
        <FloatingParticles />
      </div>

      <div className="container mx-auto max-w-7xl z-10 relative">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">Your Learning Dashboard</h1>
          <p className="mt-3 text-purple-200">Track your academic progress and get personalized recommendations</p>
        </div>

        {/* Welcome Card with Avatar */}
        <div>
          <ProfessionalCard>
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-6">
                      <Badge3D cgpa={latestPrediction?.cgpa || 0} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Welcome back, {user?.username || "Student"}!</h2>
                      <p className="text-purple-200 mt-1">
                        {latestPrediction ? (
                          <>
                            Your latest predicted CGPA is{" "}
                            <span className="font-semibold text-purple-400">{latestPrediction.cgpa.toFixed(2)}</span>
                          </>
                        ) : (
                          "You haven't made any predictions yet."
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    {latestPrediction && (
                      <Button
                        variant="outline"
                        onClick={downloadReport}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    )}
                    <Link href="/predict">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">Make New Prediction</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ProfessionalCard>
        </div>

        {predictions.length === 0 ? (
          <div>
            <Alert className="mb-8 bg-red-900/30 border-red-500/30 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No prediction data</AlertTitle>
              <AlertDescription>
                You haven't made any predictions yet. Start by making your first prediction to see your dashboard.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto bg-black/40 border border-purple-500/20">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Subjects
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Goals
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Tips
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <GlassmorphicCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white">Current CGPA Prediction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{latestPrediction?.cgpa.toFixed(2)}</div>
                      <p className="text-xs text-purple-300 mt-1">
                        {latestPrediction && predictions.length > 1 ? (
                          latestPrediction.cgpa > predictions[predictions.length - 2].cgpa ? (
                            <span className="text-green-400 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Improved from {predictions[predictions.length - 2].cgpa.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-red-400">
                              Decreased from {predictions[predictions.length - 2].cgpa.toFixed(2)}
                            </span>
                          )
                        ) : (
                          "First prediction"
                        )}
                      </p>
                    </CardContent>
                  </GlassmorphicCard>
                </div>

                <div>
                  <GlassmorphicCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white">Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{latestPrediction?.data.attendance}%</div>
                      <Progress value={latestPrediction?.data.attendance} className="h-2 mt-2" />
                      <p className="text-xs text-purple-300 mt-1">
                        {latestPrediction?.data.attendance && latestPrediction.data.attendance < 75 ? (
                          <span className="text-amber-400">Needs improvement</span>
                        ) : (
                          <span className="text-green-400">Good standing</span>
                        )}
                      </p>
                    </CardContent>
                  </GlassmorphicCard>
                </div>

                <div>
                  <GlassmorphicCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white">Average Theory Marks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {latestPrediction && (
                        <>
                          <div className="text-3xl font-bold text-white">
                            {(
                              latestPrediction.data.subjects.reduce((sum, subject) => sum + subject.marks, 0) /
                              latestPrediction.data.subjects.length
                            ).toFixed(1)}
                          </div>
                          <Progress
                            value={
                              (latestPrediction.data.subjects.reduce((sum, subject) => sum + subject.marks, 0) /
                                latestPrediction.data.subjects.length /
                                60) *
                              100
                            }
                            className="h-2 mt-2"
                          />
                          <p className="text-xs text-purple-300 mt-1">Out of 60 marks</p>
                        </>
                      )}
                    </CardContent>
                  </GlassmorphicCard>
                </div>

                <div>
                  <GlassmorphicCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white">Average Practical Marks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {latestPrediction && (
                        <>
                          <div className="text-3xl font-bold text-white">
                            {(
                              latestPrediction.data.practicalSubjects.reduce((sum, subject) => sum + subject.marks, 0) /
                              latestPrediction.data.practicalSubjects.length
                            ).toFixed(1)}
                          </div>
                          <Progress
                            value={
                              (latestPrediction.data.practicalSubjects.reduce(
                                (sum, subject) => sum + subject.marks,
                                0,
                              ) /
                                latestPrediction.data.practicalSubjects.length /
                                30) *
                              100
                            }
                            className="h-2 mt-2"
                          />
                          <p className="text-xs text-purple-300 mt-1">Out of 30 marks</p>
                        </>
                      )}
                    </CardContent>
                  </GlassmorphicCard>
                </div>
              </div>

              <div>
                <GlassmorphicCard>
                  <CardHeader>
                    <CardTitle className="text-white">CGPA Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {predictions.length > 0 && <Line data={cgpaChartData} options={lineChartOptions} />}
                    </div>
                  </CardContent>
                </GlassmorphicCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <GlassmorphicCard>
                    <CardHeader>
                      <CardTitle className="text-white">Performance Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">{factorsData && <Bar data={factorsData} options={barChartOptions} />}</div>
                    </CardContent>
                  </GlassmorphicCard>
                </div>

                <div>
                  <GlassmorphicCard>
                    <CardHeader>
                      <CardTitle className="text-white">Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        {performanceRadarData && <Radar data={performanceRadarData} options={radarChartOptions} />}
                      </div>
                    </CardContent>
                  </GlassmorphicCard>
                </div>
              </div>

              <div>
                <GlassmorphicCard>
                  <CardHeader>
                    <CardTitle className="text-white">Theory vs Practical Component</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {theoryVsPracticalData && <Pie data={theoryVsPracticalData} options={pieChartOptions} />}
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-sm text-purple-200">
                        Theory component (70%) and Practical component (30%) contribution to your final CGPA
                      </p>
                    </div>
                  </CardContent>
                </GlassmorphicCard>
              </div>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <GlassmorphicCard>
                    <CardHeader>
                      <CardTitle className="text-white">Theory Subject Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        {subjectChartData && <Pie data={subjectChartData} options={pieChartOptions} />}
                      </div>
                    </CardContent>
                  </GlassmorphicCard>
                </div>

                <div>
                  <GlassmorphicCard>
                    <CardHeader>
                      <CardTitle className="text-white">Practical Subject Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        {practicalChartData && <Pie data={practicalChartData} options={pieChartOptions} />}
                      </div>
                    </CardContent>
                  </GlassmorphicCard>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <GlassmorphicCard>
                    <CardHeader>
                      <CardTitle className="text-white">Theory Subject Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {latestPrediction &&
                          latestPrediction.data.subjects.map((subject, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-white">{subject.name}</span>
                                <span className="text-purple-200">{subject.marks}/60</span>
                              </div>
                              <Progress value={(subject.marks / 60) * 100} className="h-2" />
                              <p className="text-xs text-purple-300 mt-1">
                                {subject.marks < 30 ? (
                                  <span className="text-red-400">Needs significant improvement</span>
                                ) : subject.marks < 45 ? (
                                  <span className="text-amber-400">Could be improved</span>
                                ) : (
                                  <span className="text-green-400">Good performance</span>
                                )}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </GlassmorphicCard>
                </div>

                <div>
                  <GlassmorphicCard>
                    <CardHeader>
                      <CardTitle className="text-white">Practical Subject Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {latestPrediction &&
                          latestPrediction.data.practicalSubjects.map((subject, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-white">{subject.name}</span>
                                <span className="text-purple-200">{subject.marks}/30</span>
                              </div>
                              <Progress value={(subject.marks / 30) * 100} className="h-2" />
                              <p className="text-xs text-purple-300 mt-1">
                                {subject.marks < 15 ? (
                                  <span className="text-red-400">Needs significant improvement</span>
                                ) : subject.marks < 22 ? (
                                  <span className="text-amber-400">Could be improved</span>
                                ) : (
                                  <span className="text-green-400">Good performance</span>
                                )}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </GlassmorphicCard>
                </div>
              </div>

              <div>
                <GlassmorphicCard>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Study Resources</CardTitle>
                    <BookOpen className="h-5 w-5 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-purple-200">
                        Based on your performance, here are some recommended study resources:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {latestPrediction &&
                          latestPrediction.data.subjects.map((subject, index) => (
                            <div
                              key={index}
                              className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                            >
                              <h4 className="font-semibold mb-2 text-white">{subject.name} Resources</h4>
                              <ul className="list-disc list-inside text-sm space-y-1 text-purple-200">
                                <li>Interactive video tutorials</li>
                                <li>Practice question bank</li>
                                <li>Concept maps and summaries</li>
                              </ul>
                            </div>
                          ))}
                      </div>

                      <Link href="/study-plan">
                        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white transform transition-transform hover:scale-105">
                          Generate Personalized Study Plan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </GlassmorphicCard>
              </div>

              {showPractice && (
                <div>
                  <GlassmorphicCard>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-purple-400" />
                        Practice Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PracticeGenerator subject={latestPrediction?.weakestSubject || "General"} />
                    </CardContent>
                  </GlassmorphicCard>
                </div>
              )}
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-8">
              <div>
                <GoalSetting />
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-8">
              <div>
                <GlassmorphicCard>
                  <CardHeader>
                    <CardTitle className="text-white">Personalized Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tips.length > 0 ? (
                      <div className="space-y-4">
                        {tips.map((tip, index) => (
                          <div
                            key={index}
                            className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded-lg transform transition-all duration-300 hover:scale-102 hover:shadow-md"
                          >
                            <p className="text-purple-100">{tip}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-purple-200">
                        No specific recommendations at this time. Keep up the good work!
                      </p>
                    )}
                  </CardContent>
                </GlassmorphicCard>
              </div>

              <div>
                <GlassmorphicCard>
                  <CardHeader>
                    <CardTitle className="text-white">Study Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-purple-200">Here's a recommended study schedule based on your performance:</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-white">Weekday Schedule</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-purple-200">
                            <li>Morning: Focus on your weakest subject</li>
                            <li>Afternoon: Review lecture notes</li>
                            <li>Evening: Practice problems and assignments</li>
                          </ul>
                        </div>

                        <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-white">Weekend Schedule</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-purple-200">
                            <li>Morning: Review week's material</li>
                            <li>Afternoon: Practice tests and quizzes</li>
                            <li>Evening: Prepare for upcoming week</li>
                          </ul>
                        </div>
                      </div>

                      <Link href="/study-plan">
                        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white transform transition-transform hover:scale-105">
                          Generate Custom Schedule
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </GlassmorphicCard>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
