"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function ThreeDModel() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Sample data for visualization
  const data = [7.5, 8.2, 6.8, 9.0, 7.2]
  const colors = ["#8b5cf6", "#6d28d9", "#4c1d95", "#7c3aed", "#5b21b6"]

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="w-full h-full relative perspective-1000"
    >
      {/* 3D Scene Container */}
      <div
        className="absolute inset-0 transform-gpu transition-transform duration-200"
        style={{
          transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${-mousePosition.y * 15}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 transform-gpu" style={{ transform: "translateZ(-50px)" }}>
          <div className="w-full h-full grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={`grid-${i}`}
                className="border border-purple-500/10 rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.001 }}
              />
            ))}
          </div>
        </div>

        {/* 3D Bar Chart */}
        <div
          className="absolute inset-0 flex items-end justify-center gap-6 p-8 transform-gpu"
          style={{ transform: "translateZ(20px)" }}
        >
          {data.map((value, index) => (
            <motion.div
              key={index}
              className="w-12 rounded-t-lg relative"
              style={{
                background: `linear-gradient(to top, ${colors[index]}, ${colors[index]}CC)`,
                boxShadow: `0 0 20px ${colors[index]}66`,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${value * 10}%` }}
              transition={{
                duration: 1.5,
                delay: 0.5 + index * 0.2,
                type: "spring",
                stiffness: 50,
              }}
            >
              {/* Value label */}
              <motion.div
                className="absolute -top-8 left-0 right-0 text-center text-white font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
              >
                {value}
              </motion.div>

              {/* Reflection effect */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-lg" />

              {/* Animated pulse */}
              <motion.div
                className="absolute inset-0 rounded-t-lg bg-white/20"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* CGPA Label */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 text-center text-white text-2xl font-bold py-4 transform-gpu"
          style={{ transform: "translateZ(30px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          CGPA Visualization
        </motion.div>

        {/* Floating data points */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`point-${i}`}
              className="absolute w-3 h-3 rounded-full bg-purple-500/70"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                boxShadow: "0 0 10px rgba(139, 92, 246, 0.7)",
              }}
              initial={{ opacity: 0, scale: 0, z: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                z: Math.random() * 50,
              }}
              transition={{
                duration: 0.5,
                delay: 1 + i * 0.1,
                z: {
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
            />
          ))}
        </div>

        {/* Animated connecting lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ transform: "translateZ(10px)" }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {Array.from({ length: 8 }).map((_, i) => (
            <motion.path
              key={`line-${i}`}
              d={`M${100 + Math.random() * 200},${100 + Math.random() * 200} C${150 + Math.random() * 100},${150 + Math.random() * 100} ${200 + Math.random() * 100},${50 + Math.random() * 100} ${250 + Math.random() * 100},${100 + Math.random() * 200}`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 1 + i * 0.2 }}
            />
          ))}
        </svg>

        {/* Glowing orb in center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 blur-md transform-gpu"
          style={{ transform: "translateZ(40px)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Top-right corner decoration */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <motion.path
              d="M100 0v100H0C0 44.8 44.8 0 100 0z"
              fill="rgba(139, 92, 246, 0.1)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
          </svg>
        </motion.div>

        {/* Bottom-left corner decoration */}
        <motion.div
          className="absolute bottom-0 left-0 w-32 h-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <motion.path
              d="M0 100V0h100C100 55.2 55.2 100 0 100z"
              fill="rgba(99, 102, 241, 0.1)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}
