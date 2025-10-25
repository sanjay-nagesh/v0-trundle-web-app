"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto flex items-center justify-between p-6"
      >
        <h1 className="text-2xl font-serif font-semibold">Profile</h1>
      </motion.div>

      {/* Profile Content */}
      <div className="flex-1 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto space-y-6"
        >
          {/* Avatar & Info */}
          <Card className="p-6 bg-card/60 backdrop-blur-sm rounded-3xl shadow-md">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-lg">
                🐾
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-serif font-semibold">Traveler</h2>
                <p className="text-sm text-muted-foreground">traveler@trundle.app</p>
              </div>
            </div>
          </Card>

          {/* Stats Summary */}
          <Card className="p-6 bg-card/60 backdrop-blur-sm rounded-3xl shadow-md">
            <h3 className="font-serif text-lg mb-4">Your Journey</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <p className="text-3xl font-bold text-primary">23.4</p>
                <p className="text-xs text-muted-foreground">Kms</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-3xl font-bold text-secondary">5</p>
                <p className="text-xs text-muted-foreground">Stories</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-3xl font-bold text-primary">48</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </Card>

          {/* Settings Options */}
          <Card className="p-4 bg-card/60 backdrop-blur-sm rounded-3xl shadow-md">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl hover:bg-primary/10">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Edit Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl hover:bg-primary/10">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Notifications
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-base rounded-xl hover:bg-destructive/10 text-destructive"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNav active="profile" />
    </div>
  )
}
