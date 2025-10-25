"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const stories = ["The Whispering Pines", "The Road Beneath Stars", "Tales of the Forgotten Mill"]

export default function NowPlayingPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStory, setCurrentStory] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentStory((curr) => (curr + 1) % stories.length)
            return 0
          }
          return prev + 1
        })
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #5A6F4E 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, #8B5E3C 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, #5A6F4E 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Back Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/home")} className="rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 bg-card/90 backdrop-blur-md shadow-2xl rounded-3xl">
          <div className="space-y-8">
            {/* Story Title */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Now playing</p>
              <motion.h2
                key={currentStory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-serif italic text-foreground text-balance"
              >
                {stories[currentStory]}
              </motion.h2>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.floor(progress * 1.5)}s</span>
                <span>2:30</span>
              </div>
            </div>

            {/* Play/Pause Button */}
            <div className="flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  size="icon"
                  className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-xl"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Location */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono">📍 47.6062°N, 122.3321°W</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Pulsing Wave Effect */}
      {isPlaying && (
        <motion.div
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-32 h-32 rounded-full border-4 border-primary" />
        </motion.div>
      )}
    </div>
  )
}
