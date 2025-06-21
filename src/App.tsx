import React, { useState, useEffect, useCallback } from 'react'
import { generateExpression } from './api'
import WordMemory from './WordMemory'

interface Expression {
  topic: string
  context: string
  directExpression: string
  nativeExpression: string
  category: string
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'expression' | 'wordmemory'>('home')
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

  // 启动表达式页面时生成内容
  useEffect(() => {
    if (currentPage === 'expression' && !currentExpression) {
      generateNewContent()
    }
  }, [currentPage, currentExpression, generateNewContent])

  // 渲染主页
  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            🤖 AI English Coach
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            选择你的英语学习方式
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 表达式对比卡片 */}
          <div
            onClick={() => setCurrentPage('expression')}
            className="bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">💬</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                AI 表达式对比
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                学习直译 vs 地道表达的差异
              </p>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold">
                开始学习 →
              </div>
            </div>
          </div>

          {/* 谐音记单词卡片 */}
          <div
            onClick={() => setCurrentPage('wordmemory')}
            className="bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">🧠</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                谐音记单词
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                用中文谐音梗轻松记住英文单词
              </p>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold">
                开始记忆 →
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-xl text-gray-500">
            ✨ 两种不同的学习方式，让英语学习更有趣！
          </p>
        </div>
      </div>
    </div>
  )

  // 根据当前页面渲染不同内容
  if (currentPage === 'home') {
    return renderHomePage()
  }

  if (currentPage === 'wordmemory') {
    return (
      <div>
        {/* 返回按钮 */}
        <div className="fixed top-4 left-4 z-10">
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
          >
            ← 返回主页
          </button>
        </div>
        <WordMemory />
      </div>
    )
  }

  // 表达式页面的错误处理
  if (currentPage === 'expression' && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={generateNewContent}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-full"
            >
              Try Again
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-full"
            >
              返回主页
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 表达式页面的加载状态
  if (currentPage === 'expression' && (!currentExpression || isLoading)) {
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

  // 表达式对比页面 - 此时 currentExpression 已确保不为 null
  const expression = currentExpression!

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* 返回按钮 */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          ← 返回主页
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
              {expression.category} • AI Generated
            </div>
            <h2 className="text-3xl font-bold mb-3">
              {expression.topic}
            </h2>
            <p className="text-xl text-blue-100 italic">
              {expression.context}
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
                      "{expression.directExpression}"
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
                      "{expression.nativeExpression}"
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
