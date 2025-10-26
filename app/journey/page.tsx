"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { MapPin, Navigation, Pause, Play, Volume2, VolumeX, Loader2 } from "lucide-react"

interface Location {
  latitude: number
  longitude: number
  accuracy: number
}

export default function JourneyPage() {
  const router = useRouter()
  const [location, setLocation] = useState<Location | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [distance, setDistance] = useState(0)
  const [storyTitle, setStoryTitle] = useState("Generating your story...")
  const [storyProgress, setStoryProgress] = useState(0)
  const [isLoadingStory, setIsLoadingStory] = useState(false)
  const [storiesPlayed, setStoriesPlayed] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const previousLocationRef = useRef<Location | null>(null)
  const previousStoriesRef = useRef<string[]>([])

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

  const generateAndPlayStory = async (currentLocation: Location) => {
    if (isLoadingStory) return

    setIsLoadingStory(true)
    setStoryTitle("Generating your story...")

    try {
      // Generate story text
      const storyResponse = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: currentLocation,
          previousStories: previousStoriesRef.current,
        }),
      })

      if (!storyResponse.ok) {
        throw new Error("Failed to generate story")
      }

      const { story } = await storyResponse.json()

      // Store story theme to avoid repetition
      previousStoriesRef.current.push(story.substring(0, 50))
      if (previousStoriesRef.current.length > 5) {
        previousStoriesRef.current.shift()
      }

      setStoryTitle("The Wandering Path")

      // Convert story to speech
      const ttsResponse = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: story }),
      })

      if (!ttsResponse.ok) {
        throw new Error("Failed to generate speech")
      }

      const contentType = ttsResponse.headers.get("content-type")

      if (contentType?.includes("application/json")) {
        // Use browser TTS
        const { useBrowserTTS, text } = await ttsResponse.json()
        if (useBrowserTTS && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.rate = 0.9
          utterance.pitch = 1.0
          utterance.volume = isMuted ? 0 : 1

          utterance.onstart = () => {
            setIsPlaying(true)
          }

          utterance.onend = () => {
            setStoriesPlayed((prev) => prev + 1)
            setStoryProgress(0)
            setTimeout(() => {
              if (location) {
                generateAndPlayStory(location)
              }
            }, 2000)
          }

          // Simulate progress for browser TTS
          const words = text.split(" ").length
          const estimatedDuration = (words / 150) * 60 * 1000 // ~150 words per minute
          const progressInterval = setInterval(() => {
            setStoryProgress((prev) => {
              if (prev >= 100) {
                clearInterval(progressInterval)
                return 100
              }
              return prev + 100 / (estimatedDuration / 100)
            })
          }, 100)

          window.speechSynthesis.speak(utterance)
          setIsLoadingStory(false)
          return
        }
      }

      // Get audio blob and create URL (original API audio path)
      const audioBlob = await ttsResponse.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Play audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = audioUrl
        audioRef.current.load()

        audioRef.current.onloadedmetadata = () => {
          if (!isMuted) {
            audioRef.current?.play()
            setIsPlaying(true)
          }
        }

        audioRef.current.onended = () => {
          setStoriesPlayed((prev) => prev + 1)
          setStoryProgress(0)
          // Generate next story after a short delay
          setTimeout(() => {
            if (location) {
              generateAndPlayStory(location)
            }
          }, 2000)
        }

        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
            setStoryProgress(progress)
          }
        }
      }

      setIsLoadingStory(false)
    } catch (error) {
      console.error("Error generating/playing story:", error)
      setStoryTitle("Error loading story")
      setIsLoadingStory(false)
    }
  }

  // Initialize geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    const geolocationOptions = {
      enableHighAccuracy: true,
      maximumAge: 10000, // Allow cached position up to 10 seconds old
      timeout: 30000, // Increased timeout to 30 seconds
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

        generateAndPlayStory(newLocation)
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
        generateAndPlayStory(fallbackLocation)
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
    }
  }, [])

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = isMuted ? 0 : 1

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1
    }
  }, [isMuted])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleEndJourney = () => {
    if (audioRef.current) {
      audioRef.current.pause()
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
              <div className="flex-1 flex items-center gap-2">
                {isLoadingStory && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                <div>
                  <h3 className="font-serif font-semibold text-lg">{storyTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isLoadingStory ? "Generating..." : `Story ${storiesPlayed + 1}`}
                  </p>
                </div>
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
                disabled={isLoadingStory}
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
              <span>Stories generated automatically based on your location</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
