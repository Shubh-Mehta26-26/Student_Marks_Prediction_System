"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ProfessionalCard } from "@/components/professional-card"
import { FloatingParticles } from "@/components/floating-particles"
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { StepIndicator } from "@/components/step-indicator"
import { useAuth } from "@/lib/auth-context"
import { usePrediction } from "@/lib/prediction-context"
import { predictCGPA } from "@/lib/ml-model"
import { Result } from "./result"

export default function PredictPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<null | {
    cgpa: number
    message: string
    tips: string[]
    weakestSubject: string
    weakestPractical?: string
  }>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { addPrediction } = usePrediction()

  const [formData, setFormData] = useState({
    attendance: 75,
    participation: 7,
    assignment: "yes",
    previousCGPA: 7.5,
    interest: 75,
    subjects: [
      { name: "Mathematics", marks: 45 },
      { name: "Physics", marks: 42 },
      { name: "Computer Science", marks: 48 },
    ],
    practicalSubjects: [{ name: "Physics Lab", marks: 22 }],
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isAuthenticated, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "previousCGPA" ? Number.parseFloat(value) : Number.parseInt(value, 10),
    })
  }

  const handleSubjectChange = (index: number, field: string, value: string | number) => {
    const updatedSubjects = [...formData.subjects]
    if (field === "name") {
      updatedSubjects[index].name = value as string
    } else {
      updatedSubjects[index].marks = value as number
    }
    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const handlePracticalSubjectChange = (index: number, field: string, value: string | number) => {
    const updatedPracticalSubjects = [...formData.practicalSubjects]
    if (field === "name") {
      updatedPracticalSubjects[index].name = value as string
    } else {
      updatedPracticalSubjects[index].marks = value as number
    }
    setFormData({ ...formData, practicalSubjects: updatedPracticalSubjects })
  }

  const addSubject = () => {
    if (formData.subjects.length < 5) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, { name: "", marks: 40 }],
      })
    } else {
      toast({
        title: "Maximum subjects reached",
        description: "You can add a maximum of 5 subjects.",
        variant: "destructive",
      })
    }
  }

  const removeSubject = (index: number) => {
    if (formData.subjects.length > 3) {
      const updatedSubjects = [...formData.subjects]
      updatedSubjects.splice(index, 1)
      setFormData({ ...formData, subjects: updatedSubjects })
    } else {
      toast({
        title: "Minimum subjects required",
        description: "You need at least 3 subjects for prediction.",
        variant: "destructive",
      })
    }
  }

  const addPracticalSubject = () => {
    if (formData.practicalSubjects.length < 3) {
      setFormData({
        ...formData,
        practicalSubjects: [...formData.practicalSubjects, { name: "", marks: 20 }],
      })
    } else {
      toast({
        title: "Maximum practical subjects reached",
        description: "You can add a maximum of 3 practical subjects.",
        variant: "destructive",
      })
    }
  }

  const removePracticalSubject = (index: number) => {
    if (formData.practicalSubjects.length > 1) {
      const updatedPracticalSubjects = [...formData.practicalSubjects]
      updatedPracticalSubjects.splice(index, 1)
      setFormData({ ...formData, practicalSubjects: updatedPracticalSubjects })
    } else {
      toast({
        title: "Minimum practical subjects required",
        description: "You need at least 1 practical subject for prediction.",
        variant: "destructive",
      })
    }
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Make prediction using our ML model
      const prediction = predictCGPA(formData)

      // Save prediction to context
      addPrediction(formData, prediction)

      // Set result for display
      setResult(prediction)

      // Show success toast
      toast({
        title: "Prediction Complete",
        description: "Your CGPA prediction has been calculated successfully.",
        variant: "default",
      })

      // Move to results step
      setStep(3)
    } catch (error) {
      console.error("Prediction error:", error)
      toast({
        title: "Prediction Failed",
        description: "There was an error making your prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0">
        <FloatingParticles />
      </div>

      <div className="container mx-auto max-w-4xl z-10 relative">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">Predict Your CGPA</h1>
          <p className="mt-3 text-purple-200">Enter your academic details to get an AI-powered prediction</p>
        </div>

        <div className="mb-10">
          <StepIndicator
            steps={[
              { label: "Basic Details", isActive: step >= 1, isCompleted: step > 1 },
              { label: "Subject Details", isActive: step >= 2, isCompleted: step > 2 },
              { label: "Results", isActive: step >= 3, isCompleted: false },
            ]}
          />
        </div>

        {step === 1 && (
          <div>
            <ProfessionalCard>
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Basic Academic Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="attendance" className="text-purple-100">
                          Attendance Percentage ({formData.attendance}%)
                        </Label>
                        <Slider
                          id="attendance"
                          min={0}
                          max={100}
                          step={1}
                          value={[formData.attendance]}
                          onValueChange={(value) => setFormData({ ...formData, attendance: value[0] })}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-purple-300">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="participation" className="text-purple-100">
                          Class Participation (out of 10): {formData.participation}
                        </Label>
                        <Slider
                          id="participation"
                          min={1}
                          max={10}
                          step={1}
                          value={[formData.participation]}
                          onValueChange={(value) => setFormData({ ...formData, participation: value[0] })}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-purple-300">
                          <span>Low</span>
                          <span>Medium</span>
                          <span>High</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-purple-100">Assignment Completion</Label>
                        <RadioGroup
                          value={formData.assignment}
                          onValueChange={(value) => setFormData({ ...formData, assignment: value })}
                          className="flex space-x-8 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="assignment-yes" className="text-purple-600" />
                            <Label htmlFor="assignment-yes" className="text-purple-100">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="assignment-no" className="text-purple-600" />
                            <Label htmlFor="assignment-no" className="text-purple-100">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="previousCGPA" className="text-purple-100">
                          Previous CGPA
                        </Label>
                        <Input
                          id="previousCGPA"
                          name="previousCGPA"
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={formData.previousCGPA}
                          onChange={handleInputChange}
                          className="bg-purple-950/50 border-purple-500/30 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="interest" className="text-purple-100">
                          Interest in Study ({formData.interest}%)
                        </Label>
                        <Slider
                          id="interest"
                          min={0}
                          max={100}
                          step={1}
                          value={[formData.interest]}
                          onValueChange={(value) => setFormData({ ...formData, interest: value[0] })}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-purple-300">
                          <span>Low</span>
                          <span>Medium</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </ProfessionalCard>
          </div>
        )}

        {step === 2 && (
          <div>
            <ProfessionalCard>
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Subject Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Theory Subjects (out of 60 marks)</h3>
                      <div className="space-y-4">
                        {formData.subjects.map((subject, index) => (
                          <div key={index} className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <Label htmlFor={`subject-${index}`} className="text-purple-100">
                                  Subject Name
                                </Label>
                                <Input
                                  id={`subject-${index}`}
                                  value={subject.name}
                                  onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                                  className="bg-purple-950/50 border-purple-500/30 text-white"
                                  placeholder="e.g. Mathematics"
                                  required
                                />
                              </div>
                              <div className="w-full md:w-1/3">
                                <Label htmlFor={`marks-${index}`} className="text-purple-100">
                                  Marks (out of 60)
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id={`marks-${index}`}
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={subject.marks}
                                    onChange={(e) =>
                                      handleSubjectChange(index, "marks", Number.parseInt(e.target.value))
                                    }
                                    className="bg-purple-950/50 border-purple-500/30 text-white"
                                    required
                                  />
                                  {formData.subjects.length > 3 && (
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removeSubject(index)}
                                      className="flex-shrink-0"
                                    >
                                      &times;
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {formData.subjects.length < 5 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addSubject}
                            className="w-full border-dashed border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                          >
                            + Add Another Theory Subject
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Practical Subjects (out of 30 marks)</h3>
                      <div className="space-y-4">
                        {formData.practicalSubjects.map((subject, index) => (
                          <div key={index} className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <Label htmlFor={`practical-${index}`} className="text-purple-100">
                                  Practical Subject Name
                                </Label>
                                <Input
                                  id={`practical-${index}`}
                                  value={subject.name}
                                  onChange={(e) => handlePracticalSubjectChange(index, "name", e.target.value)}
                                  className="bg-purple-950/50 border-purple-500/30 text-white"
                                  placeholder="e.g. Physics Lab"
                                  required
                                />
                              </div>
                              <div className="w-full md:w-1/3">
                                <Label htmlFor={`practical-marks-${index}`} className="text-purple-100">
                                  Marks (out of 30)
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id={`practical-marks-${index}`}
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={subject.marks}
                                    onChange={(e) =>
                                      handlePracticalSubjectChange(index, "marks", Number.parseInt(e.target.value))
                                    }
                                    className="bg-purple-950/50 border-purple-500/30 text-white"
                                    required
                                  />
                                  {formData.practicalSubjects.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removePracticalSubject(index)}
                                      className="flex-shrink-0"
                                    >
                                      &times;
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {formData.practicalSubjects.length < 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addPracticalSubject}
                            className="w-full border-dashed border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                          >
                            + Add Another Practical Subject
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous Step
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Predict CGPA
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </ProfessionalCard>
          </div>
        )}

        {step === 3 && result && <Result result={result} formData={formData} onReset={handleReset} />}
      </div>
    </div>
  )
}
