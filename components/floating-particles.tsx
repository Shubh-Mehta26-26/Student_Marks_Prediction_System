"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  depth: number
}

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particles: Particle[] = []
    const particleCount = 80

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      const size = Math.random() * 6 + 1
      const opacity = Math.random() * 0.5 + 0.1
      const depth = Math.random() * 3 // 0 = far, 3 = close

      particle.className = "absolute rounded-full"
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.opacity = opacity.toString()

      // Different colors based on depth
      if (depth < 1) {
        particle.style.backgroundColor = "#c4b5fd" // Light purple
      } else if (depth < 2) {
        particle.style.backgroundColor = "#a78bfa" // Medium purple
      } else {
        particle.style.backgroundColor = "#8b5cf6" // Dark purple
      }

      // Add blur based on depth
      particle.style.filter = `blur(${(3 - depth) * 0.5}px)`

      // Set z-index based on depth
      particle.style.zIndex = Math.floor(depth).toString()

      const particleData: Particle = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        speedX: (Math.random() - 0.5) * 0.2 * depth, // Faster if closer
        speedY: (Math.random() - 0.5) * 0.2 * depth,
        opacity,
        depth,
      }

      particles.push(particleData)

      particle.style.left = `${particleData.x}%`
      particle.style.top = `${particleData.y}%`

      // Add transform for 3D effect
      particle.style.transform = `translateZ(${particleData.depth * 20}px)`

      container.appendChild(particle)
    }

    // Animate particles
    const particleElements = container.children
    let animationFrameId: number

    const animate = () => {
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        const element = particleElements[i] as HTMLDivElement

        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= 100) {
          particle.speedX *= -1
        }

        if (particle.y <= 0 || particle.y >= 100) {
          particle.speedY *= -1
        }

        element.style.left = `${particle.x}%`
        element.style.top = `${particle.y}%`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden perspective-1000"
      style={{ transformStyle: "preserve-3d" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}
