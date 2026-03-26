import OpenAI from 'openai'

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'CRM FTE Hackathon',
  },
})

// FREE models available on OpenRouter
export const FREE_MODELS = {
  gemma: 'google/gemma-2-27b-it:free',
  llama: 'meta-llama/llama-3.2-3b-instruct:free',
  mistral: 'mistralai/mistral-7b-instruct:free',
} as const

export type AgentMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type ToolCall = {
  name: string
  arguments: Record<string, unknown>
}

export async function chatWithAgent(
  messages: AgentMessage[],
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[]
) {
  try {
    const completion = await openrouter.chat.completions.create({
      model: FREE_MODELS.llama,
      messages,
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0].message
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    throw new Error('AI service unavailable')
  }
}

export function parseToolCall(content: string): ToolCall | null {
  try {
    const match = content.match(/```json\s*({[\s\S]*?})\s*```/)
    if (match) {
      return JSON.parse(match[1])
    }
    const direct = JSON.parse(content)
    return direct as ToolCall
  } catch {
    return null
  }
}
