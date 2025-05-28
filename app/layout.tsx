import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { AIChatbot } from "@/components/ai-chatbot"
import { AuthProvider } from "@/lib/auth-context"
import { PredictionProvider } from "@/lib/prediction-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Marks Prediction System",
  description: "Predict your academic performance using AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <PredictionProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <AIChatbot />
              <Toaster />
            </PredictionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
