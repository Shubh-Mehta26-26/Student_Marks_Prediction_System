"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ProfessionalCardProps {
  children: ReactNode
  className?: string
}

export function ProfessionalCard({ children, className }: ProfessionalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        boxShadow: "0 10px 30px -10px rgba(124, 58, 237, 0.3)",
        borderColor: "rgba(139, 92, 246, 0.5)",
      }}
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 border border-purple-500/10",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
