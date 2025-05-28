import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Create a system message for the academic assistant
  const systemMessage = {
    role: "system",
    content: `You are an empathetic and helpful academic assistant for a student marks prediction system. 
    Respond with emotion and personality, using emojis occasionally to express feelings.
    Keep responses concise (under 150 words) but informative.
    Focus on providing practical advice for academic improvement, study techniques, and career guidance.
    When discussing subjects, emphasize both theoretical understanding and practical applications.
    Be encouraging but honest about areas that need improvement.`,
  }

  // Add the system message to the beginning of the messages array
  const enhancedMessages = [systemMessage, ...messages]

  const result = streamText({
    model: openai("gpt-4o"),
    messages: enhancedMessages,
    temperature: 0.7, // Add some creativity to responses
    maxTokens: 250, // Keep responses concise
  })

  return result.toDataStreamResponse()
}
