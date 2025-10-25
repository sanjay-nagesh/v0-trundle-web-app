"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"

const stories = [
  { id: 1, title: "The Whispering Pines", location: "Seattle, WA", duration: "2:30", date: "Today" },
  { id: 2, title: "The Road Beneath Stars", location: "Portland, OR", duration: "3:15", date: "Yesterday" },
  { id: 3, title: "Tales of the Forgotten Mill", location: "Eugene, OR", duration: "2:45", date: "2 days ago" },
  { id: 4, title: "Echoes of the Valley", location: "Bend, OR", duration: "3:00", date: "3 days ago" },
  { id: 5, title: "The Lighthouse Keeper", location: "Astoria, OR", duration: "2:20", date: "1 week ago" },
]

export default function LibraryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto flex items-center justify-between p-6"
      >
        <h1 className="text-2xl font-serif font-semibold">Library</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Button>
      </motion.div>

      {/* Stories List */}
      <div className="flex-1 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto space-y-4"
        >
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5 bg-card/60 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-serif text-lg text-foreground leading-tight">{story.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {story.location}
                      </span>
                      <span>•</span>
                      <span>{story.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{story.date}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground border-primary/20"
                    onClick={() => router.push("/now-playing")}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <BottomNav active="library" />
    </div>
  )
}
