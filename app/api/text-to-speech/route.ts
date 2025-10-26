import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    console.log("[v0] TTS request received, using browser TTS")

    // Always return instruction to use browser-based text-to-speech
    return NextResponse.json({ useBrowserTTS: true, text })
  } catch (error) {
    console.error("[v0] TTS error:", error)
    return NextResponse.json(
      {
        error: "Failed to process text-to-speech request",
        useBrowserTTS: true,
        text: "",
      },
      { status: 500 },
    )
  }
}
