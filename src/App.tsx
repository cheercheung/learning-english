import React, { useState, useEffect, useCallback } from 'react'
import { generateExpression } from './api'

interface Expression {
  topic: string
  context: string
  directExpression: string
  nativeExpression: string
  category: string
}

function App() {
  const [currentExpression, setCurrentExpression] = useState<Expression | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const generateNewContent = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      // Generate new expression using AI
      const newExpression = await generateExpression()
      setCurrentExpression(newExpression)

    } catch (err) {
      console.error('Error generating content:', err)
      setError('Failed to generate new content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    generateNewContent()
  }, [generateNewContent])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={generateNewContent}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!currentExpression) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="animate-spin text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI is thinking...</h2>
          <p className="text-gray-600">Generating your personalized English lesson</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Row 1: Header - Keep unchanged */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🤖 AI English Native Speaker Coach
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            AI-powered personalized lessons - Learn how native speakers really talk
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Topic Title Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              {currentExpression.category} • AI Generated
            </div>
            <h2 className="text-3xl font-bold mb-3">
              {currentExpression.topic}
            </h2>
            <p className="text-xl text-blue-100 italic">
              {currentExpression.context}
            </p>
          </div>

          {/* Row 2: Comparison Cards */}
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                {/* Direct Expression Card */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">❌</span>
                    <h4 className="text-lg font-bold text-red-800">
                      Direct Translation
                    </h4>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <p className="text-red-700 font-medium text-xl">
                      "{currentExpression.directExpression}"
                    </p>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="text-center">
                  <div className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold text-lg">
                    VS
                  </div>
                </div>

                {/* Native Expression Card */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">✅</span>
                    <h4 className="text-lg font-bold text-green-800">
                      Native Expression
                    </h4>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <p className="text-green-700 font-medium text-xl">
                      "{currentExpression.nativeExpression}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 text-center">
              <button
                onClick={generateNewContent}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
              >
                {isLoading ? '🤖 AI Generating...' : '🎲 Generate New Lesson'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-lg mt-6">
          <p>✨ Powered by AI - Every lesson is unique and personalized!</p>
        </div>
      </div>
    </div>
  )
}

export default App
