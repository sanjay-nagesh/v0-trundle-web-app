import { type NextRequest, NextResponse } from "next/server"

const FALLBACK_STORIES = [
  "As you drive through these winding roads, imagine the countless travelers who've passed this way before. Each curve in the road tells a story of adventure, of journeys taken and destinations reached. The landscape around you has witnessed generations of wanderers, each leaving their mark in the whispers of the wind. Your journey adds another chapter to this timeless tale.",
  "The horizon stretches endlessly before you, a canvas of possibilities. In this moment, you're part of something greater—a tradition of exploration that spans centuries. The road beneath your wheels has carried dreamers, adventurers, and seekers of all kinds. As the miles pass, remember that every journey transforms us, shaping who we become.",
  "Listen closely, and you might hear the echoes of ancient travelers on this path. The land remembers every footstep, every wheel that has turned upon it. Your presence here connects you to a vast tapestry of human experience, woven through time and space. This road is more than asphalt—it's a living story, and you're writing your verse.",
  "The open road calls to something primal within us—a yearning for discovery, for freedom, for the unknown. As you navigate these paths, you're following in the footsteps of explorers and pioneers who dared to venture beyond the familiar. Each mile marker is a testament to human curiosity, each rest stop a gathering place for stories yet to be told.",
  "In the rhythm of your wheels on pavement, there's a meditation. The world outside your window becomes a moving painting, each scene a brushstroke in the masterpiece of your journey. Time seems to bend here, where the destination matters less than the transformation that happens along the way. This is where stories are born.",
  "The landscape shifts and changes, but the road remains constant—a ribbon of possibility connecting past to future. Ancient trade routes once crossed these lands, carrying spices and stories, dreams and discoveries. Now you carry forward that legacy, adding your own chapter to the eternal book of the road. Every journey is a pilgrimage.",
  "As twilight paints the sky in shades of amber and violet, your journey takes on a magical quality. The road ahead glows with promise, while behind you, the day's adventures fade into memory. This liminal space between day and night, between here and there, is where the most profound stories unfold. You are both the traveler and the tale.",
  "Mountains rise in the distance, their peaks touching clouds that have traveled farther than you can imagine. The road winds through valleys carved by ancient rivers, past forests that have stood for centuries. Your passage is but a moment in geological time, yet in this moment, you are infinite. The journey makes philosophers of us all.",
]

export async function POST(request: NextRequest) {
  try {
    const { location, previousStories = [] } = await request.json()

    if (!location || !location.latitude || !location.longitude) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    console.log("[v0] Story generation request for location:", location)

    const availableStories = FALLBACK_STORIES.filter((story) => !previousStories.includes(story.substring(0, 50)))

    const storyPool = availableStories.length > 0 ? availableStories : FALLBACK_STORIES
    const randomStory = storyPool[Math.floor(Math.random() * storyPool.length)]

    console.log("[v0] Story selected from library")
    return NextResponse.json({ story: randomStory })
  } catch (error) {
    console.error("[v0] Story generation error:", error)
    const randomStory = FALLBACK_STORIES[0]
    return NextResponse.json({ story: randomStory })
  }
}
