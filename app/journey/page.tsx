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

const STORY_LIBRARY = [
  {
    title: "The Wandering Path",
    text: "As you drive through these winding roads, imagine the countless travelers who have passed this way before you. Each curve in the road tells a story of adventure, of journeys taken and destinations reached. The landscape shifts around you, a living tapestry of nature's artistry.",
  },
  {
    title: "Echoes of the Highway",
    text: "The highway stretches endlessly before you, a ribbon of possibility cutting through the heart of the land. Listen closely, and you might hear the whispers of stories carried on the wind - tales of road trips past, of laughter shared and memories made.",
  },
  {
    title: "Twilight Travels",
    text: "As the sun begins its descent, painting the sky in shades of amber and rose, your journey takes on a magical quality. The world transforms in this golden hour, and every mile becomes a meditation on the beauty of the open road.",
  },
  {
    title: "Mountain Memories",
    text: "The mountains rise majestically in the distance, ancient sentinels watching over your passage. These peaks have witnessed millennia of change, yet they remain constant - a reminder that some things endure beyond the passage of time.",
  },
  {
    title: "Coastal Dreams",
    text: "Can you smell the salt air? Even if the ocean is miles away, there's something about this stretch of road that speaks of coastal adventures. Perhaps it's the way the light plays across the landscape, or the sense of freedom that comes with the open road.",
  },
  {
    title: "Forest Whispers",
    text: "The trees stand tall on either side of the road, their branches forming a natural cathedral overhead. In the dappled sunlight filtering through the leaves, you can almost hear the forest breathing, alive with stories of its own.",
  },
  {
    title: "Desert Solitude",
    text: "In the vast expanse of the desert, there's a profound sense of solitude and peace. The road ahead shimmers in the heat, and the landscape seems to stretch on forever. Here, in this emptiness, you find a fullness of spirit.",
  },
  {
    title: "River Roads",
    text: "Following the curve of the river, your journey mirrors the flow of water - sometimes rushing, sometimes meandering, but always moving forward. The river has carved its path through the land over countless years, just as you're carving your own path through life.",
  },
]

export default function JourneyPage() {
  const router = useRouter()
  const [location, setLocation] = useState<Location | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [distance, setDistance] = useState(0)
  const [currentStory, setCurrentStory] = useState(STORY_LIBRARY[0])
  const [storyProgress, setStoryProgress] = useState(0)
  const [storiesPlayed, setStoriesPlayed] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)
  const watchIdRef = useRef<number | null>(null)
  const previousLocationRef = useRef<Location | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  const playStory = (story: (typeof STORY_LIBRARY)[0]) => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported")
      return
    }

    // Stop any existing speech
    window.speechSynthesis.cancel()
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    setCurrentStory(story)
    setStoryProgress(0)

    const utterance = new SpeechSynthesisUtterance(story.text)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = isMuted ? 0 : 1

    utterance.onstart = () => {
      setIsPlaying(true)
    }

    utterance.onend = () => {
      setStoriesPlayed((prev) => prev + 1)
      setStoryProgress(100)

      // Play next story after a short delay
      setTimeout(() => {
        const nextIndex = (storyIndex + 1) % STORY_LIBRARY.length
        setStoryIndex(nextIndex)
        playStory(STORY_LIBRARY[nextIndex])
      }, 2000)
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      setIsPlaying(false)
    }

    // Simulate progress
    const words = story.text.split(" ").length
    const estimatedDuration = (words / 150) * 60 * 1000 // ~150 words per minute
    let elapsed = 0

    progressIntervalRef.current = setInterval(() => {
      elapsed += 100
      const progress = Math.min((elapsed / estimatedDuration) * 100, 100)
      setStoryProgress(progress)

      if (progress >= 100 && progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }, 100)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  // Initialize geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      // Use fallback location
      const fallbackLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 1000,
      }
      setLocation(fallbackLocation)
      previousLocationRef.current = fallbackLocation

      // Start playing first story
      playStory(STORY_LIBRARY[0])
      return
    }

    const geolocationOptions = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 30000,
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setLocation(newLocation)
        previousLocationRef.current = newLocation

        // Start playing first story
        playStory(STORY_LIBRARY[0])
      },
      (error) => {
        console.error("Geolocation error:", error.message)
        const fallbackLocation = {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 1000,
        }
        setLocation(fallbackLocation)
        previousLocationRef.current = fallbackLocation

        // Start playing first story
        playStory(STORY_LIBRARY[0])
      },
      geolocationOptions,
    )

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

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
        console.error("Geolocation watch error:", error.message)
      },
      geolocationOptions,
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      window.speechSynthesis.cancel()
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (utteranceRef.current && window.speechSynthesis.speaking) {
      // Restart with new volume
      const wasPlaying = isPlaying
      window.speechSynthesis.cancel()
      if (wasPlaying && utteranceRef.current) {
        utteranceRef.current.volume = isMuted ? 0 : 1
        window.speechSynthesis.speak(utteranceRef.current)
      }
    }
  }, [isMuted])

  const handlePlayPause = () => {
    if (!("speechSynthesis" in window)) return

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      } else {
        playStory(currentStory)
      }
      setIsPlaying(true)
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleEndJourney = () => {
    window.speechSynthesis.cancel()
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
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
              <p className="text-xs text-muted-foreground">km traveled</p>
            </div>
          </Card>
          <Card className="bg-card/90 backdrop-blur-md shadow-lg rounded-xl p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-secondary">{storiesPlayed}</p>
              <p className="text-xs text-muted-foreground">stories played</p>
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
                <h3 className="font-serif font-semibold text-lg">{currentStory.title}</h3>
                <p className="text-sm text-muted-foreground">Story {storiesPlayed + 1}</p>
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
                  style={{ width: `${storyProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.floor(storyProgress)}%</span>
                <span>{isPlaying ? "Playing" : "Paused"}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-transparent" disabled>
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

              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-transparent" disabled>
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
              <span>Stories play automatically as you travel</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
