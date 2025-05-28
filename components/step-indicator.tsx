"use client"

import { motion } from "framer-motion"

interface Step {
  label: string
  isActive: boolean
  isCompleted: boolean
}

interface StepIndicatorProps {
  steps: Step[]
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Step circle */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{
              scale: step.isActive ? 1 : 0.8,
              backgroundColor: step.isCompleted
                ? "rgb(126, 34, 206)"
                : step.isActive
                  ? "rgb(147, 51, 234)"
                  : "rgba(147, 51, 234, 0.3)",
            }}
            className={`
              relative flex items-center justify-center w-10 h-10 rounded-full 
              border-2 border-purple-600 z-10
            `}
          >
            {step.isCompleted ? (
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            ) : (
              <span className="text-white font-medium">{index + 1}</span>
            )}
          </motion.div>

          {/* Step label */}
          <div className="absolute mt-16 text-center w-32" style={{ marginLeft: "-11px" }}>
            <span className={`text-sm ${step.isActive ? "text-white font-medium" : "text-purple-300"}`}>
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 w-24 bg-purple-900">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: step.isCompleted ? "100%" : "0%" }}
                className="h-full bg-purple-600"
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
