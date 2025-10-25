"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { useState } from "react"

const storyMarkers = [
  { id: 1, title: "The Whispering Pines", location: "Seattle, WA", lat: 47.6, lon: -122.3 },
  { id: 2, title: "The Road Beneath Stars", location: "Portland, OR", lat: 45.5, lon: -122.6 },
  { id: 3, title: "Tales of the Forgotten Mill", location: "Eugene, OR", lat: 44.0, lon: -123.0 },
]

export default function MapPage() {
  const router = useRouter()
  const [selectedStory, setSelectedStory] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto flex items-center justify-between p-6"
      >
        <h1 className="text-2xl font-serif font-semibold">Journey Map</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </motion.div>

      {/* Map Placeholder */}
      <div className="flex-1 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-auto h-[400px] bg-muted/30 backdrop-blur-sm rounded-3xl overflow-hidden relative">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

            {/* Story Markers */}
            {storyMarkers.map((marker, index) => (
              <motion.button
                key={marker.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => setSelectedStory(marker.id)}
                className="absolute w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center text-white font-bold hover:scale-110 transition-transform"
                style={{
                  left: `${30 + index * 25}%`,
                  top: `${40 + index * 15}%`,
                }}
              >
                {index + 1}
              </motion.button>
            ))}
          </Card>
        </motion.div>

        {/* Story List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md mx-auto mt-6 space-y-3"
        >
          {storyMarkers.map((marker) => (
            <Card
              key={marker.id}
              className={`p-4 bg-card/60 backdrop-blur-sm rounded-2xl shadow-md cursor-pointer transition-all ${
                selectedStory === marker.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedStory(marker.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-foreground">{marker.title}</h3>
                  <p className="text-sm text-muted-foreground">{marker.location}</p>
                </div>
                <Button
                  size="sm"
                  className="rounded-full bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/now-playing")
                  }}
                >
                  View
                </Button>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>

      <BottomNav active="map" />
    </div>
  )
}
