"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { MapPin, Navigation, Pause, Play, Volume2, VolumeX } from "lucide-react"

interface Location {
  latitude: number
  longitude: number
  accuracy: number
}

export default function JourneyPage() {
  const router = useRouter()
  const [location, setLocation] = useState<Location | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [distance, setDistance] = useState(0)
  const [storyTitle, setStoryTitle] = useState("The Wandering Path")
  const [storyProgress, setStoryProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const previousLocationRef = useRef<Location | null>(null)

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Initialize geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("[v0] Geolocation not supported")
      return
    }

    console.log("[v0] Starting geolocation tracking")

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        console.log("[v0] Initial location:", newLocation)
        setLocation(newLocation)
        previousLocationRef.current = newLocation
      },
      (error) => {
        console.log("[v0] Geolocation error:", error.message)
      },
    )

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

        console.log("[v0] Location updated:", newLocation)
        setLocation(newLocation)

        // Calculate distance traveled
        if (previousLocationRef.current) {
          const distanceTraveled = calculateDistance(
            previousLocationRef.current.latitude,
            previousLocationRef.current.longitude,
            newLocation.latitude,
            newLocation.longitude,
          )
          setDistance((prev) => prev + distanceTraveled)
        }

        previousLocationRef.current = newLocation
      },
      (error) => {
        console.log("[v0] Geolocation watch error:", error.message)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Initialize audio playback
  useEffect(() => {
    // Create a simple audio context for background audio
    // In production, this would load actual story audio files
    console.log("[v0] Initializing audio playback")

    // Simulate audio progress
    const progressInterval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 0.5
      })
    }, 1000)

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    console.log("[v0] Audio playback:", !isPlaying ? "playing" : "paused")
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    console.log("[v0] Audio muted:", !isMuted)
  }

  const handleEndJourney = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4f8] to-[#d4e8e0]">
        {/* Simulated map with grid */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated route line */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-1/2 h-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(90deg, #5a6f4e 0%, #8b5e3c 100%)",
            transformOrigin: "left",
          }}
        />

        {/* User location marker */}
        <AnimatePresence>
          {location && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Navigation className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nearby points of interest */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/3 right-1/3"
        >
          <MapPin className="w-6 h-6 text-secondary" />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-1/3 left-1/4"
        >
          <MapPin className="w-6 h-6 text-secondary" />
        </motion.div>
      </div>

      {/* Top Info Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-md mx-auto p-4"
      >
        <Card className="bg-card/95 backdrop-blur-md shadow-xl rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-serif font-semibold text-lg">Journey Active</h2>
                <p className="text-xs text-muted-foreground">
                  {location ? `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°W` : "Locating..."}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleEndJourney} className="rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 w-full max-w-md mx-auto px-4 mt-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card/90 backdrop-blur-md shadow-lg rounded-xl p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{distance.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">km</p>
            </div>
          </Card>
          <Card className="bg-card/90 backdrop-blur-md shadow-lg rounded-xl p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-secondary">{Math.floor(storyProgress / 10)}</p>
              <p className="text-xs text-muted-foreground">stories</p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Audio Player Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-20 p-4"
      >
        <Card className="w-full max-w-md mx-auto bg-card/95 backdrop-blur-md shadow-2xl rounded-3xl p-6">
          <div className="space-y-4">
            {/* Story Info */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-lg">{storyTitle}</h3>
                <p className="text-sm text-muted-foreground">Chapter {Math.floor(storyProgress / 20) + 1}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="rounded-full">
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary" />
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${storyProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.floor(storyProgress)}%</span>
                <span>Auto-playing</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-transparent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>

              <Button
                onClick={handlePlayPause}
                size="icon"
                className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-primary-foreground" />
                ) : (
                  <Play className="w-7 h-7 text-primary-foreground ml-1" />
                )}
              </Button>

              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-transparent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>

            {/* Auto-play indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <span>Story playing automatically based on your location</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
