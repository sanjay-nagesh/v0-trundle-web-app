"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"

export default function HomePage() {
  const router = useRouter()
  const [isJourneyActive, setIsJourneyActive] = useState(false)

  const handleStartJourney = () => {
    setIsJourneyActive(true)
    setTimeout(() => {
      router.push("/journey")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto flex items-center justify-between p-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg">🐾</span>
          </div>
          <h1 className="text-xl font-serif font-semibold">Trundle</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm shadow-xl rounded-3xl">
            <div className="space-y-6">
              <motion.div
                animate={isJourneyActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Button
                  onClick={handleStartJourney}
                  disabled={isJourneyActive}
                  className="w-full h-16 text-xl font-serif rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg relative overflow-hidden"
                >
                  {isJourneyActive ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                      >
                        ⚡
                      </motion.span>
                      Journey in progress...
                    </span>
                  ) : (
                    "Start Journey"
                  )}
                </Button>
              </motion.div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isJourneyActive ? "Searching for nearby stories..." : "Ready to begin your adventure"}
                </p>
                <p className="text-xs text-muted-foreground font-mono">📍 47.6062°N, 122.3321°W</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md grid grid-cols-3 gap-4"
        >
          <Card className="p-4 bg-card/60 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-primary">23.4</p>
              <p className="text-xs text-muted-foreground">Kms Travelled</p>
            </div>
          </Card>
          <Card className="p-4 bg-card/60 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-secondary">5</p>
              <p className="text-xs text-muted-foreground">Stories Heard</p>
            </div>
          </Card>
          <Card className="p-4 bg-card/60 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-primary">48</p>
              <p className="text-xs text-muted-foreground">Active Time</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNav active="home" />
    </div>
  )
}
