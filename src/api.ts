interface GeneratedExpression {
  topic: string
  context: string
  directExpression: string
  nativeExpression: string
  category: string
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPEN_ROUTER_KEY
const MODEL = import.meta.env.VITE_MODEL

export async function generateExpression(): Promise<GeneratedExpression> {
  const prompt = `Generate a random English learning scenario comparing direct translation vs native speaker expression.

Respond with ONLY a valid JSON object (no additional text) in this exact format:
{
  "topic": "Brief topic name (3-5 words)",
  "context": "Short scenario when this phrase would be used",
  "directExpression": "How a non-native speaker might directly translate the phrase",
  "nativeExpression": "How a native speaker would naturally say the same thing",
  "category": "One of: Daily Life, Social, Weather, Emotions, Food, Business, Travel, Communication",
  "imagePrompt": "Descriptive phrase for image search (2-4 words, describe the scene)"
}

🔍 Expression Type Guide:
- "directExpression" (普通表达)：A common literal or textbook-style phrase that non-native speakers might say. It is grammatically correct but may sound awkward, overly formal, or translated directly from another language,very simple,may use 3 or 4 words.
- "nativeExpression" (地道表达)：A natural, conversational phrase that native speakers commonly use in the same context. It sounds fluid, emotionally appropriate, and culturally authentic.

✅ Focus on short, everyday phrases (not long sentences or formal writing).
✅ Both expressions must reflect the same meaning in the same situation.
✅ Do NOT include explanations — only return a valid JSON object.

🔁 Sample output:
{
  "topic": "Showing Affection",
  "context": "You're telling someone you have romantic feelings for them.",
  "directExpression": "I like you.",
  "nativeExpression": "I'm into you.",
  "category": "Emotions",
  "imagePrompt": "romantic couple talking"}`;

  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not found')
    return getFallbackExpression()
  }

  try {
    console.log('Calling OpenRouter API with model:', MODEL)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'English Native Speaker Coach'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data: OpenRouterResponse = await response.json()
    console.log('API Response data:', data)

    const content = data.choices[0]?.message?.content

    if (!content) {
      console.error('No content received from API')
      throw new Error('No content received from API')
    }

    console.log('Raw AI response:', content)

    // Clean the response and parse JSON
    let cleanContent = content.trim()

    // Remove markdown code blocks if present
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/, '').replace(/\n?```$/, '')
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/, '').replace(/\n?```$/, '')
    }

    // Parse the JSON response
    const generatedData = JSON.parse(cleanContent) as GeneratedExpression

    console.log('Parsed data:', generatedData)
    return generatedData

  } catch (error) {
    console.error('Error generating expression:', error)
    return getFallbackExpression()
  }
}

function getFallbackExpression(): GeneratedExpression {
  const fallbacks = [
    {
      topic: "Asking for directions",
      context: "You're lost and need help finding a place",
      directExpression: "Where is the bank?",
      nativeExpression: "Do you know where the bank is?",
      category: "Daily Life"
    },
    {
      topic: "Ordering coffee",
      context: "You want to buy coffee at a cafe",
      directExpression: "I want one coffee.",
      nativeExpression: "I'll take a coffee, please.",
      category: "Food"
    },
    {
      topic: "Expressing gratitude",
      context: "Someone helps you with something",
      directExpression: "Thank you very much.",
      nativeExpression: "I really appreciate it!",
      category: "Social"
    },
    {
      topic: "Making small talk",
      context: "You meet someone in an elevator",
      directExpression: "The weather is good today.",
      nativeExpression: "Nice day, isn't it?",
      category: "Social"
    },
    {
      topic: "Declining an offer",
      context: "Someone offers you food you don't want",
      directExpression: "No, I do not want it.",
      nativeExpression: "I'm good, thanks!",
      category: "Social"
    }
  ]

  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}


