"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@/lib/supabase/server"

export async function generateScriptAction(formData: FormData) {
  const topic = formData.get("topic") as string
  const platform = formData.get("platform") as string
  const tone = formData.get("tone") as string
  const length = formData.get("length") as string || "general"
  const customDuration = formData.get("customDuration") as string
  const language = formData.get("language") as string || "English"

  if (!topic || !platform) {
    throw new Error("Missing topic or platform")
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // 1. Quota Check for Free Users
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, usage_count')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium || false
  const usageCount = profile?.usage_count || 0
  const FREE_LIMIT = 5

  if (!isPremium && usageCount >= FREE_LIMIT) {
    throw new Error(`Free limit of ${FREE_LIMIT} scripts reached. Upgrade to Pro for unlimited generation.`)
  }

  // 2. Map Length to Approximate Seconds for Prompt
  let durationHint = "60 seconds"
  let dbDuration = 60

  if (length === "short") {
    durationHint = "30-45 seconds"
    dbDuration = 45
  } else if (length === "indepth") {
    durationHint = "180+ seconds"
    dbDuration = 180
  } else if (length === "custom" && customDuration) {
    durationHint = `${customDuration} seconds`
    dbDuration = parseInt(customDuration) || 60
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

  const prompt = `
    You are an expert scriptwriter for social media.
    Create a viral ${platform} script about "${topic}".
    
    Constraints:
    - Tone: ${tone}
    - Duration: Approximately ${durationHint} spoken duration.
    - Language: ${language} (Write the script in ${language}. If the language is Tamil, Telugu, Kannada, Hindi, or similar, use the native script (not Transliteration) unless specifically common to mix commonly used English words for tech terms.)
    - Format: Return strictly a JSON object. Do NOT wrap in markdown code blocks.
    
    JSON Schema:
    {
      "visuals": ["Visual cue 1", "Visual cue 2", ...],
      "audio": ["Audio line 1", "Audio line 2", ...],
      "hook": "The opening hook text",
      "hashtags": ["#tag1", "#tag2"]
    }
    
    Ensure the "visuals" and "audio" arrays have the same length and correspond line-by-line.
    Make it engaging, fast-paced, and suitable for the chosen platform.
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean up potential markdown formatting
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim()
    const json = JSON.parse(cleanedText)

    // 3. Save to Database
    const { error: insertError } = await supabase
      .from("scripts")
      .insert({
        user_id: user.id,
        title: topic,
        topic: topic,
        platform,
        tone,
        content: json,
        duration_seconds: dbDuration
      })
      .select()
      .single()

    if (insertError) throw new Error("Failed to save script: " + insertError.message)

    // 4. Increment Usage for Free Users
    if (!isPremium) {
      await supabase
        .from('profiles')
        .update({ usage_count: usageCount + 1 })
        .eq('id', user.id)
    }

    return json
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to generate script"
    console.error("Gemini Generation Error:", error)
    throw new Error(msg)
  }
}
