"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { X, Send, Bot, User, BookOpen, GraduationCap, BarChart, Calendar, Search } from "lucide-react"
import { usePrediction } from "@/lib/prediction-context"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  emotion?: "neutral" | "happy" | "sad" | "excited" | "thoughtful" | "concerned"
  category?: "study" | "career" | "prediction" | "plan" | "general"
}

// Predefined responses based on keywords
const PREDEFINED_RESPONSES = [
  {
    keywords: ["study", "learn", "studying", "learning", "book", "read", "class"],
    responses: [
      {
        text: "Effective studying is all about quality over quantity! Try the Pomodoro technique: 25 minutes of focused study followed by a 5-minute break. 📚 This helps maintain concentration and prevents burnout.",
        emotion: "excited",
        category: "study",
      },
      {
        text: "I recommend creating mind maps to connect concepts visually. This technique helps with understanding relationships between ideas and improves recall during exams. 🧠",
        emotion: "thoughtful",
        category: "study",
      },
      {
        text: "Active recall is one of the most effective study techniques! Instead of just re-reading notes, try to explain concepts in your own words or quiz yourself regularly. This strengthens memory pathways. ✏️",
        emotion: "happy",
        category: "study",
      },
    ],
  },
  {
    keywords: ["career", "job", "profession", "work", "industry", "employment", "future"],
    responses: [
      {
        text: "When planning your career, focus on developing transferable skills like critical thinking, communication, and problem-solving. These are valuable in any field and provide flexibility as industries evolve. 🚀",
        emotion: "excited",
        category: "career",
      },
      {
        text: "Consider informational interviews with professionals in fields you're interested in. This gives you real insights into day-to-day work and helps you make informed career decisions. 👔",
        emotion: "thoughtful",
        category: "career",
      },
      {
        text: "Your academic performance is important, but employers also value extracurricular activities, internships, and projects that demonstrate practical application of your knowledge. 💼",
        emotion: "happy",
        category: "career",
      },
    ],
  },
  {
    keywords: ["predict", "cgpa", "grade", "score", "result", "performance", "marks"],
    responses: [
      {
        text: "Based on your current performance, I can see areas where small improvements could significantly impact your CGPA. Focus on consistency rather than cramming before exams. 📊",
        emotion: "thoughtful",
        category: "prediction",
      },
      {
        text: "Your prediction results show potential for improvement! Remember that regular attendance and participation contribute significantly to your overall performance. 📈",
        emotion: "excited",
        category: "prediction",
      },
      {
        text: "Looking at your prediction data, balancing theory and practical subjects is key. Make sure you're not neglecting one aspect over the other. 🔍",
        emotion: "concerned",
        category: "prediction",
      },
    ],
  },
  {
    keywords: ["plan", "schedule", "timetable", "routine", "organize", "strategy", "time"],
    responses: [
      {
        text: "A well-structured study plan should include regular breaks and time for relaxation. Try allocating specific time blocks for different subjects, with more time for challenging topics. 📅",
        emotion: "thoughtful",
        category: "plan",
      },
      {
        text: "When creating your study schedule, be realistic about what you can accomplish each day. It's better to consistently meet achievable goals than to set unrealistic expectations. ⏰",
        emotion: "concerned",
        category: "plan",
      },
      {
        text: "Consider your energy levels when planning! Schedule difficult subjects during your peak productivity hours and use lower-energy periods for review or lighter topics. 🌟",
        emotion: "happy",
        category: "plan",
      },
    ],
  },
  {
    keywords: ["help", "confused", "understand", "explain", "clarify", "how to"],
    responses: [
      {
        text: "I'm here to help! Breaking down complex topics into smaller, manageable parts often makes them easier to understand. What specific aspect are you struggling with? 🤔",
        emotion: "thoughtful",
        category: "general",
      },
      {
        text: "Sometimes a different perspective helps! Try looking at the problem from another angle or using different learning resources like videos, diagrams, or practical examples. 💡",
        emotion: "excited",
        category: "general",
      },
      {
        text: "Don't worry - confusion is often part of the learning process! It means you're engaging with challenging material, which leads to deeper understanding in the long run. 🌱",
        emotion: "concerned",
        category: "general",
      },
    ],
  },
  {
    keywords: ["stress", "anxiety", "worried", "overwhelmed", "pressure", "mental health"],
    responses: [
      {
        text: "Academic stress is common, but remember to prioritize your wellbeing. Regular exercise, adequate sleep, and mindfulness practices can significantly reduce stress levels. 🧘‍♂️",
        emotion: "concerned",
        category: "general",
      },
      {
        text: "When feeling overwhelmed, try breaking large tasks into smaller, manageable steps. Celebrate completing each step to maintain motivation and reduce anxiety. 🌈",
        emotion: "thoughtful",
        category: "general",
      },
      {
        text: "Don't hesitate to reach out to academic counselors or mental health resources at your institution. They're there to support you through challenging periods. 💚",
        emotion: "sad",
        category: "general",
      },
    ],
  },
  {
    keywords: ["thank", "thanks", "appreciate", "helpful", "great"],
    responses: [
      {
        text: "You're very welcome! I'm glad I could help. Feel free to ask if you have any other questions! 😊",
        emotion: "happy",
        category: "general",
      },
      {
        text: "It's my pleasure to assist you! Remember, I'm here whenever you need academic guidance or support. 🌟",
        emotion: "excited",
        category: "general",
      },
      {
        text: "Happy to help! Your success is what matters most. Keep up the great work with your studies! 📚",
        emotion: "happy",
        category: "general",
      },
    ],
  },
]

// Default fallback responses when no keywords match
const FALLBACK_RESPONSES = [
  {
    text: "I'm here to help with your academic journey! Feel free to ask about study techniques, career planning, or understanding your prediction results. 🎓",
    emotion: "happy",
    category: "general",
  },
  {
    text: "Could you provide more details about your question? I'd love to give you more specific guidance related to your studies or academic performance. 🤔",
    emotion: "thoughtful",
    category: "general",
  },
  {
    text: "I'm your academic assistant! I can help with study strategies, understanding your prediction results, planning your academic schedule, or exploring career options. What would you like to know? 📚",
    emotion: "excited",
    category: "general",
  },
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! 👋 I'm your academic assistant. How can I help you today with your studies, career planning, or academic predictions?",
      sender: "bot",
      timestamp: new Date(),
      emotion: "excited",
      category: "general",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { predictions } = usePrediction()
  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Simulate typing effect
  useEffect(() => {
    if (isTyping && messages.length > 0) {
      const typingTimer = setTimeout(() => {
        setIsTyping(false)
      }, 1000)
      return () => clearTimeout(typingTimer)
    }
  }, [isTyping, messages])

  const getEmotionIcon = (emotion: "neutral" | "happy" | "sad" | "excited" | "thoughtful" | "concerned") => {
    switch (emotion) {
      case "happy":
        return "😊"
      case "sad":
        return "😔"
      case "excited":
        return "🤩"
      case "thoughtful":
        return "🤔"
      case "concerned":
        return "😟"
      default:
        return "😐"
    }
  }

  const getCategoryIcon = (category: "study" | "career" | "prediction" | "plan" | "general") => {
    switch (category) {
      case "study":
        return <BookOpen className="h-4 w-4 text-blue-400" />
      case "career":
        return <GraduationCap className="h-4 w-4 text-green-400" />
      case "prediction":
        return <BarChart className="h-4 w-4 text-purple-400" />
      case "plan":
        return <Calendar className="h-4 w-4 text-orange-400" />
      default:
        return <Bot className="h-4 w-4 text-gray-400" />
    }
  }

  const findResponseByKeywords = (input: string) => {
    const lowerInput = input.toLowerCase()

    // Check each predefined response category
    for (const category of PREDEFINED_RESPONSES) {
      // Check if any keyword from this category is in the input
      if (category.keywords.some((keyword) => lowerInput.includes(keyword))) {
        // Return a random response from this category
        const randomIndex = Math.floor(Math.random() * category.responses.length)
        return category.responses[randomIndex]
      }
    }

    // If no keywords matched, return a random fallback response
    const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length)
    return FALLBACK_RESPONSES[randomIndex]
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Find appropriate response based on keywords
    const response = findResponseByKeywords(input)

    // Add context from prediction data if available
    let contextualizedResponse = response.text

    if (latestPrediction && (response.category === "prediction" || response.category === "study")) {
      // Add personalized context based on prediction data
      if (latestPrediction.weakestSubject) {
        contextualizedResponse += ` I notice that ${latestPrediction.weakestSubject} might need some extra attention.`
      }

      if (latestPrediction.data.attendance < 75) {
        contextualizedResponse += ` Also, improving your attendance (currently ${latestPrediction.data.attendance}%) could help boost your overall performance.`
      }
    }

    // Simulate typing delay for more natural conversation
    setTimeout(
      () => {
        // Add bot message
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: contextualizedResponse,
          sender: "bot",
          timestamp: new Date(),
          emotion: response.emotion,
          category: response.category,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  // Predefined quick questions
  const quickQuestions = [
    { text: "How can I improve my grades?", category: "study" },
    { text: "What career options do I have?", category: "career" },
    { text: "Help me create a study plan", category: "plan" },
    { text: "Explain my prediction results", category: "prediction" },
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <>
      {/* Chatbot toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-4 shadow-lg z-50 hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 z-50"
          >
            <Card className="border-purple-500/20 overflow-hidden shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-5">
                <CardTitle className="text-lg flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold">Academic Assistant</div>
                    <div className="text-xs font-normal opacity-80">Always here to help</div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === "bot" ? (
                            <div className="flex flex-col items-center mt-1">
                              <div className="bg-purple-100 dark:bg-gray-700 p-1 rounded-full">
                                <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              {message.emotion && (
                                <span className="text-xs mt-1">{getEmotionIcon(message.emotion)}</span>
                              )}
                            </div>
                          ) : (
                            <div className="bg-white/20 p-1 rounded-full mt-1">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                          <div className="flex-1">
                            {message.sender === "bot" && message.category && (
                              <div className="flex items-center mb-1">
                                {getCategoryIcon(message.category)}
                                <span className="text-xs ml-1 opacity-70 capitalize">{message.category}</span>
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 dark:bg-gray-700 p-1 rounded-full">
                            <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce mr-1"></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce mr-1"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(q.text)}
                      className="text-xs px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center"
                    >
                      {getCategoryIcon(q.category as any)}
                      <span className="ml-1">{q.text}</span>
                    </button>
                  ))}
                </div>
                <CardFooter className="p-0">
                  <form onSubmit={handleSendMessage} className="flex w-full">
                    <div className="relative flex-grow mr-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="pr-10 rounded-full bg-white dark:bg-gray-700 border-purple-100 dark:border-gray-600 focus-visible:ring-purple-500"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="h-4 w-4" />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim()}
                      className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardFooter>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
