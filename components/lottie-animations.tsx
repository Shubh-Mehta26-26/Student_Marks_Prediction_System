"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Placeholder animations when JSON files aren't available
const placeholderAnimations = {
  analytics: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 800,
    h: 600,
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Chart",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [400, 300, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "rc",
                d: 1,
                s: { a: 0, k: [100, 200] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 0 },
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.545, 0.361, 0.965, 1] },
              },
            ],
          },
        ],
      },
    ],
  },
  dataAnalysis: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 800,
    h: 600,
    layers: [],
  },
  machineLearning: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 800,
    h: 600,
    layers: [],
  },
  education: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 800,
    h: 600,
    layers: [],
  },
  mlProcess: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 800,
    h: 600,
    layers: [],
  },
  dataVisualization: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 800,
    h: 600,
    layers: [],
  },
  aiTechnology: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 800,
    h: 600,
    layers: [],
  },
}

// Animated placeholder component with academic-themed visuals
const AnimatedPlaceholder = ({ type }: { type: string }) => {
  const colors = {
    analytics: ["#8b5cf6", "#6d28d9"],
    dataAnalysis: ["#6366f1", "#4f46e5"],
    machineLearning: ["#8b5cf6", "#7c3aed"],
    education: ["#a78bfa", "#7c3aed"],
    mlProcess: ["#c4b5fd", "#8b5cf6"],
    dataVisualization: ["#a78bfa", "#6d28d9"],
    aiTechnology: ["#7c3aed", "#4c1d95"],
  }

  const colorSet = colors[type as keyof typeof colors] || ["#8b5cf6", "#6d28d9"]

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Academic-themed animated elements */}
        {type === "analytics" && (
          <>
            {/* Bar chart */}
            <div className="absolute inset-0 flex items-end justify-center gap-4 p-8">
              {[0.7, 0.9, 0.6, 0.8, 0.5].map((height, i) => (
                <motion.div
                  key={`bar-${i}`}
                  className="w-12 rounded-t-lg"
                  style={{
                    background: `linear-gradient(to top, ${colorSet[0]}, ${colorSet[1]})`,
                    boxShadow: `0 0 15px ${colorSet[0]}66`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height * 60}%` }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    repeatDelay: 2,
                  }}
                />
              ))}
            </div>

            {/* Floating data points */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`point-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  background: i % 2 === 0 ? colorSet[0] : colorSet[1],
                  boxShadow: `0 0 10px ${colorSet[0]}`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Academic icons */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-white text-2xl font-bold">A+</span>
            </motion.div>

            <motion.div
              className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-white text-2xl font-bold">GPA</span>
            </motion.div>
          </>
        )}

        {type === "dataAnalysis" && (
          <>
            {/* Line chart */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d="M0,150 C100,100 200,200 300,100 C400,0 500,100 600,50 C700,0 800,100 900,50"
                fill="none"
                stroke={colorSet[0]}
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              />

              {/* Data points on line */}
              {[50, 150, 100, 200, 50].map((y, i) => (
                <motion.circle
                  key={`point-${i}`}
                  cx={i * 150 + 100}
                  cy={y}
                  r="8"
                  fill={colorSet[1]}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 + 2, duration: 0.5 }}
                />
              ))}
            </svg>

            {/* Floating labels */}
            <motion.div
              className="absolute top-1/4 left-1/4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-500/30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-white text-sm">Attendance: 95%</span>
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 right-1/3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-500/30"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-white text-sm">CGPA: 8.7</span>
            </motion.div>
          </>
        )}

        {type === "machineLearning" && (
          <>
            {/* Neural network visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 3 }).map((_, layer) => (
                <div key={`layer-${layer}`} className="flex flex-col gap-6 mx-8">
                  {Array.from({ length: layer === 1 ? 4 : 3 }).map((_, node) => (
                    <motion.div
                      key={`node-${layer}-${node}`}
                      className="w-10 h-10 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${colorSet[0]}, ${colorSet[1]})`,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          `0 0 0px ${colorSet[0]}80`,
                          `0 0 20px ${colorSet[0]}80`,
                          `0 0 0px ${colorSet[0]}80`,
                        ],
                      }}
                      transition={{ duration: 2, delay: node * 0.3, repeat: Number.POSITIVE_INFINITY }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1={200 + (i % 3) * 30}
                  y1={150 + Math.floor(i / 3) * 60}
                  x2={400 + (i % 3) * 30}
                  y2={120 + Math.floor(i % 4) * 60}
                  stroke={`${colorSet[0]}50`}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                />
              ))}
            </svg>
          </>
        )}

        {type === "education" ||
          type === "mlProcess" ||
          type === "dataVisualization" ||
          (type === "aiTechnology" && (
            <>
              {/* Generic academic visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-40 h-40 rounded-full"
                  style={{
                    background: `conic-gradient(${colorSet[0]} 0%, ${colorSet[1]} 50%, ${colorSet[0]} 100%)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                <motion.div
                  className="absolute w-32 h-32 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span className="text-white text-2xl font-bold">CGPA</span>
                </motion.div>
              </div>

              {/* Floating academic elements */}
              {["A+", "B+", "9.5", "8.7", "7.2"].map((grade, i) => (
                <motion.div
                  key={`grade-${i}`}
                  className="absolute px-3 py-1 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colorSet[0]}80, ${colorSet[1]}80)`,
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    backdropFilter: "blur(4px)",
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2 + i,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                  }}
                >
                  <span className="text-white font-bold">{grade}</span>
                </motion.div>
              ))}
            </>
          ))}
      </div>
    </div>
  )
}

export function AnalyticsAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    // Try to fetch the animation, fall back to placeholder
    setAnimationData(placeholderAnimations.analytics)
  }, [])

  if (!animationData) return null

  return (
    <div className="w-full h-[400px]">
      <AnimatedPlaceholder type="analytics" />
    </div>
  )
}

export function DataAnalysisAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(placeholderAnimations.dataAnalysis)
  }, [])

  if (!animationData) return null

  return (
    <div className="w-full h-[400px]">
      <AnimatedPlaceholder type="dataAnalysis" />
    </div>
  )
}

export function MachineLearnAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(placeholderAnimations.machineLearning)
  }, [])

  if (!animationData) return null

  return (
    <div className="w-full h-[400px]">
      <AnimatedPlaceholder type="machineLearning" />
    </div>
  )
}

export function EducationAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(placeholderAnimations.education)
  }, [])

  if (!animationData) return null

  return (
    <div className="w-full h-[400px]">
      <AnimatedPlaceholder type="education" />
    </div>
  )
}

export function MLProcessAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(placeholderAnimations.mlProcess)
  }, [])

  if (!animationData) return null

  return (
    <div className="w-full h-[400px]">
      <AnimatedPlaceholder type="mlProcess" />
    </div>
  )
}

export function DataVisualizationAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(placeholderAnimations.dataVisualization)
  }, [])

  if (!animationData) return null

  return (
    <div className="w-full h-[400px]">
      <AnimatedPlaceholder type="dataVisualization" />
    </div>
  )
}

export function AITechnologyAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(placeholderAnimations.aiTechnology)
  }, [])

  if (!animationData) return null

  return (
    <div className="w-full h-[400px]">
      <AnimatedPlaceholder type="aiTechnology" />
    </div>
  )
}
