"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex items-center justify-between pt-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <span className="text-lg">🐾</span>
          </div>
          <h1 className="text-xl font-serif font-semibold text-foreground">Trundle</h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex flex-col items-center justify-center text-center max-w-md"
      >
        <h2 className="text-5xl font-serif italic text-foreground mb-8 text-balance">Your Story Awaits</h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <p className="text-muted-foreground text-lg">Trundle tells stories inspired by the places you pass.</p>
        </motion.div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md space-y-4 pb-8"
      >
        <div className="space-y-3">
          <p className="text-sm text-center text-muted-foreground font-serif">Playfair Display</p>

          <Button
            onClick={() => router.push("/home")}
            className="w-full h-14 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            Sign up
          </Button>

          <Button
            onClick={() => router.push("/home")}
            className="w-full h-14 text-lg rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
          >
            Log in
          </Button>

          <Button
            onClick={() => router.push("/home")}
            variant="outline"
            className="w-full h-14 text-lg rounded-full bg-white hover:bg-white/90 border-2 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
