"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, BookOpen, MessageSquare, BarChart3, ChevronDown } from "lucide-react"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { FloatingParticles } from "@/components/floating-particles"
import { ProfessionalCard } from "@/components/professional-card"
import {
  AnalyticsAnimation,
  DataAnalysisAnimation,
  MachineLearnAnimation,
  EducationAnimation,
} from "@/components/lottie-animations"

export default function Home() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })

  const features = [
    {
      title: "AI-Powered Prediction",
      description:
        "Our advanced machine learning model with hyperparameter tuning predicts your CGPA with high accuracy based on your academic data.",
      icon: <Brain className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Interactive Visualizations",
      description:
        "View your academic progress through beautiful, animated charts and visualizations with model explanations.",
      icon: <BarChart3 className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Practice Support",
      description: "Get personalized practice questions and study materials based on your performance analysis.",
      icon: <BookOpen className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "AI Chatbot Assistant",
      description:
        "Get instant help with your academic questions from our intelligent chatbot with real-time model retraining.",
      icon: <MessageSquare className="h-10 w-10 text-purple-500" />,
    },
  ]

  return (
    <>
      {/* Hero Section with Professional Animation */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 z-0">
          <FloatingParticles />
        </div>
        <div className="container mx-auto px-4 z-10 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-700/30 backdrop-blur-sm">
                  AI-Powered Academic Insights
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Predict Your{" "}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  style={{ backgroundSize: "200% 100%" }}
                >
                  Academic Success
                </motion.span>{" "}
                With AI
              </h1>
              <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto lg:mx-0">
                Our advanced machine learning system with hyperparameter tuning predicts your CGPA and provides
                personalized study recommendations to help you excel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl relative overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatDelay: 1 }}
                    />
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-400 text-purple-100 hover:bg-purple-900/50 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2 h-[400px] flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <AnalyticsAnimation />

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-600/10 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                />

                <motion.div
                  className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-indigo-600/10 blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                />
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-purple-300/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Professional Cards */}
      <section ref={featuresRef} className="py-20 relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-black">
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <div className="px-4 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-700/30 backdrop-blur-sm">
                Advanced ML Features
              </div>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Enterprise-Grade
              </span>{" "}
              Features
            </motion.h2>

            <motion.p
              className="text-xl text-purple-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Our platform combines cutting-edge AI with hyperparameter tuning, model explanation, and real-time
              retraining.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  featuresInView
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.5,
                }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                }}
              >
                <ProfessionalCard>
                  <div className="h-full p-6 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 rounded-full p-4 mb-6 relative">
                      {/* Pulsing ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-purple-500/30"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.7, 0, 0.7],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                      />
                      {feature.icon}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-purple-200">{feature.description}</p>
                  </div>
                </ProfessionalCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Lottie Animation */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={`grid-h-${i}`}
                className="absolute left-0 right-0 h-px bg-purple-500"
                style={{ top: `${(i + 1) * 10}%` }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <DataAnalysisAnimation />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-block mb-4">
                <div className="px-4 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-700/30 backdrop-blur-sm">
                  Advanced Technology
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                How Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  ML Pipeline
                </span>{" "}
                Works
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Hyperparameter Tuning</h3>
                    <p className="text-purple-200">
                      Our system uses advanced techniques like Random Forest and XGBoost with optimized hyperparameters
                      to ensure the highest prediction accuracy for your academic performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Model Explanation</h3>
                    <p className="text-purple-200">
                      We use SHAP and LIME technologies to explain how each factor contributes to your predicted CGPA,
                      providing transparency and actionable insights for improvement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Real-time Retraining</h3>
                    <p className="text-purple-200">
                      Our models continuously learn and improve as more students provide feedback and data, ensuring
                      predictions stay relevant and accurate over time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ML Features Section with Lottie */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-block mb-4">
                <div className="px-4 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-700/30 backdrop-blur-sm">
                  Enterprise ML Features
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  Advanced
                </span>{" "}
                Machine Learning
              </h2>

              <div className="space-y-6">
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-2">Random Forest & XGBoost</h3>
                  <p className="text-purple-200">
                    Our system uses ensemble methods like Random Forest and XGBoost with grid search for hyperparameter
                    tuning, achieving up to 95% prediction accuracy.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-2">Feature Importance Analysis</h3>
                  <p className="text-purple-200">
                    We analyze which factors most influence your academic performance, helping you focus your efforts
                    where they'll have the greatest impact.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-2">Continuous Learning</h3>
                  <p className="text-purple-200">
                    Our models improve with each new data point, adapting to changing academic patterns and ensuring
                    predictions remain accurate over time.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <MachineLearnAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Features Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-indigo-950 to-black">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <EducationAnimation />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-block mb-4">
                <div className="px-4 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-700/30 backdrop-blur-sm">
                  Educational Tools
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  Personalized
                </span>{" "}
                Learning Experience
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-2">Smart Study Plans</h3>
                  <p className="text-purple-200">
                    AI-generated study schedules based on your learning patterns and predicted performance.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-2">Practice Questions</h3>
                  <p className="text-purple-200">
                    Targeted practice materials focusing on your weakest areas to maximize improvement.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-2">Performance Analytics</h3>
                  <p className="text-purple-200">
                    Detailed insights into your academic strengths and weaknesses with visual reports.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Chatbot Support</h3>
                  <p className="text-purple-200">24/7 assistance for academic questions and personalized guidance.</p>
                </div>
              </div>

              <motion.div
                className="mt-6"
                whileHover={{
                  scale: 1.03,
                }}
              >
                <Link href="/predict">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg">
                    Try Prediction Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ref} className="py-20 relative overflow-hidden bg-gradient-to-b from-black to-purple-950">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Predict Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  Academic Future
                </span>
                ?
              </h2>
            </motion.div>

            <motion.p
              className="text-xl text-purple-200 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of students who are using our AI-powered system with advanced machine learning to improve
              their academic performance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl relative overflow-hidden group"
                >
                  {/* Animated shine effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 skew-x-12"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  />
                  Start Your Prediction Journey
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                    className="inline-block ml-2"
                  >
                    <ArrowRight className="h-5 w-5 inline" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="mb-6 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold">Student Marks Prediction</h3>
              <p className="text-purple-400 mt-2">Empowering students with AI</p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {["Home", "About", "Login", "Register", "Predict"].map((item, index) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="hover:text-purple-400 transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>© {new Date().getFullYear()} Student Marks Prediction System. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </>
  )
}
