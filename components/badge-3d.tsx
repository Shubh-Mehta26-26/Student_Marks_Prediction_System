"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface Badge3DProps {
  cgpa: number
}

export function Badge3D({ cgpa }: Badge3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawBadge = () => {
      // Set canvas dimensions
      canvas.width = 120
      canvas.height = 120

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw outer circle
      ctx.beginPath()
      ctx.arc(60, 60, 55, 0, Math.PI * 2)
      ctx.fillStyle = "#4c1d95"
      ctx.fill()

      // Draw inner circle
      ctx.beginPath()
      ctx.arc(60, 60, 50, 0, Math.PI * 2)
      ctx.fillStyle = "#6d28d9"
      ctx.fill()

      // Draw text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 28px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(cgpa.toFixed(1), 60, 60)

      // Draw decorative elements
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const x1 = 60 + Math.cos(angle) * 60
        const y1 = 60 + Math.sin(angle) * 60
        const x2 = 60 + Math.cos(angle) * 70
        const y2 = 60 + Math.sin(angle) * 70

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = "#a855f7"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    drawBadge()

    // Add shadow effect
    canvas.style.filter = "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5))"
  }, [cgpa])

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="relative"
    >
      <canvas ref={canvasRef} width={120} height={120} className="rounded-full" />
    </motion.div>
  )
}
