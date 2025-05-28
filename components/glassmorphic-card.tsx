"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassmorphicCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassmorphicCard({ children, className }: GlassmorphicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-purple-500/20 bg-black/40 backdrop-blur-md",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 z-0"></div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
