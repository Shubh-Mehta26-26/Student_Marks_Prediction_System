"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Users, FileText, Award, Heart, Database, Code, Bot, ArrowRight } from "lucide-react"
import { MLProcessAnimation, DataVisualizationAnimation, AITechnologyAnimation } from "@/components/lottie-animations"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-900 py-20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: 2 + Math.random() * 4,
                  height: 2 + Math.random() * 4,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-700/30 backdrop-blur-sm">
                  Advanced ML Technology
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Our System</h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Learn how our AI-powered prediction system with hyperparameter tuning and model explanation works to
                help you achieve academic sucess.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                The Student Marks Prediction System is designed to assist students in academic planning using
                data-driven predictions. By analyzing key behavioral and academic indicators with advanced machine
                learning algorithms, our system provides insights that help you understand your potential performance
                before exams.
              </p>
              <p className="text-lg text-gray-700">
                Our goal is to empower students with the information they need to make informed decisions about their
                study habits, focus areas, and academic strategies. We use hyperparameter tuning, model explanation
                tools, and real-time model retraining to ensure the highest accuracy and transparency.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Parameters Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Prediction Parameters</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <CardTitle>Attendance Percentage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Regular attendance is strongly correlated with academic performance. It reflects commitment and
                      ensures you don't miss important concepts.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <CardTitle>Class Participation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Active participation in class discussions reflects engagement and understanding of the subject
                      matter, leading to better retention.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <CardTitle>Assignment Timeliness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Submitting assignments on time shows consistency, responsibility, and good time management skills,
                      which are crucial for academic success.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Award className="h-8 w-8 text-purple-600" />
                    <CardTitle>Previous CGPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Past performance provides a baseline and indicates your general academic capabilities and study
                      habits over time.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <CardTitle>Internal Marks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Current internal assessment marks across four subjects serve as direct indicators of your present
                      academic performance and understanding.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Heart className="h-8 w-8 text-purple-600" />
                    <CardTitle>Interest in Study</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Your level of interest and motivation in your studies is a soft factor that significantly impacts
                      your willingness to put in the necessary effort.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section with Animation */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

            <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-1/2"
              >
                <MLProcessAnimation />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-1/2"
              >
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Data Collection</h3>
                      <p className="text-gray-600">
                        You provide key academic and behavioral indicators through our user-friendly form. This includes
                        attendance, participation, assignment completion, and more.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Data Processing</h3>
                      <p className="text-gray-600">
                        Our system normalizes and processes your inputs using feature engineering techniques to prepare
                        them for our hyperparameter-tuned ML models.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Model Analysis</h3>
                      <p className="text-gray-600">
                        Our ensemble machine learning models (Random Forest & XGBoost) analyze the data based on
                        patterns learned from thousands of academic records with continuous retraining.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Explainable Prediction Output</h3>
                      <p className="text-gray-600">
                        You receive a predicted CGPA along with SHAP/LIME explanations showing which factors influenced
                        your prediction and personalized recommendations for improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section with Animation */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Technology Stack</h2>

            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-1/2"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-lg shadow-sm border border-purple-100"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Code className="h-6 w-6 mr-2 text-purple-600" />
                      Frontend
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>Next.js (React Framework)</li>
                      <li>Tailwind CSS</li>
                      <li>Framer Motion for animations</li>
                      <li>Lottie for professional animations</li>
                      <li>Chart.js for data visualization</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-lg shadow-sm border border-purple-100"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Database className="h-6 w-6 mr-2 text-purple-600" />
                      Backend & Storage
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>Next.js API Routes</li>
                      <li>TensorFlow.js for browser-based ML</li>
                      <li>Real-time model retraining</li>
                      <li>Server Actions for form processing</li>
                      <li>Secure data storage</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-lg shadow-sm border border-purple-100"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Bot className="h-6 w-6 mr-2 text-purple-600" />
                      AI Components
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>Random Forest & XGBoost Models</li>
                      <li>Hyperparameter Tuning</li>
                      <li>SHAP/LIME for model explanation</li>
                      <li>AI Chatbot for student assistance</li>
                      <li>Advanced Performance Analytics</li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-1/2 mb-8 lg:mb-0"
              >
                <DataVisualizationAnimation />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Advanced ML Features Section */}
        <section className="py-16 bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Advanced ML Features</h2>

            <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-1/2"
              >
                <AITechnologyAnimation />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-1/2"
              >
                <div className="space-y-6">
                  <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-3">Hyperparameter Tuning</h3>
                    <p className="text-purple-100">
                      Our system uses grid search and cross-validation to find the optimal parameters for our machine
                      learning models, ensuring the highest possible prediction accuracy for your academic performance.
                    </p>
                  </div>

                  <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-3">Model Explanation with SHAP/LIME</h3>
                    <p className="text-purple-100">
                      We use state-of-the-art explainable AI techniques to show you exactly which factors are
                      influencing your predicted CGPA, providing transparency and actionable insights for improvement.
                    </p>
                  </div>

                  <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-3">Real-time Model Retraining</h3>
                    <p className="text-purple-100">
                      Our models continuously learn and improve as more students provide feedback and data, ensuring
                      predictions stay relevant and accurate over time through automated retraining pipelines.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-purple-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to Predict Your Performance?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Try our prediction tool now and get personalized insights powered by advanced machine learning to
                improve your academic performance.
              </p>
              <Link href="/predict">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 group">
                  Start Prediction
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                    className="inline-block ml-2"
                  >
                    <ArrowRight className="h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">Student Marks Prediction</h3>
              <p className="text-gray-400 mt-2">Empowering students with AI</p>
            </div>
            <div className="flex space-x-8">
              <Link href="/" className="hover:text-purple-400 transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/predict" className="hover:text-purple-400 transition-colors">
                Predict
              </Link>
              <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Student Marks Prediction System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
