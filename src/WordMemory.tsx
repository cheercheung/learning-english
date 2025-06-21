import React, { useState, useEffect } from 'react'
import wordsData from '../output/words.json'

interface WordData {
  word: string
  phonetic: string
  mnemonic: string
  meaning: string
  explanation: string
}

function WordMemory() {
  const [currentWord, setCurrentWord] = useState<WordData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  // 随机获取一个单词
  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsData.length)
    setCurrentWord(wordsData[randomIndex])
    setCurrentIndex(randomIndex)
  }

  // 初始化时获取第一个单词
  useEffect(() => {
    getRandomWord()
  }, [])

  // 记住了/没记住
  const handleRemembered = (remembered: boolean) => {
    if (remembered) {
      setScore(score + 1)
    }
    setTotalAnswered(totalAnswered + 1)
    getRandomWord()
  }

  // 重置统计
  const resetStats = () => {
    setScore(0)
    setTotalAnswered(0)
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="animate-spin text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">加载中...</h2>
          <p className="text-gray-600">准备你的单词记忆之旅</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🧠 中文谐音记单词
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            用中文谐音梗，轻松记住英文单词！
          </p>
          
          {/* 统计信息 */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
              <div className="text-2xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">记住了</div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
              <div className="text-2xl font-bold text-pink-600">{totalAnswered}</div>
              <div className="text-sm text-gray-600">总计</div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
              <div className="text-2xl font-bold text-green-600">
                {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">正确率</div>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* 单词卡片 */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 text-center">
            <div className="text-6xl font-bold mb-4">
              {currentWord.word}
            </div>
            <div className="text-2xl mb-2 opacity-90">
              {currentWord.phonetic}
            </div>
            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-lg">
              第 {currentIndex + 1} / {wordsData.length} 个单词
            </div>
          </div>

          <div className="p-8">
            {/* 单词卡片 - 直接显示所有信息 */}
            <div className="space-y-8">
              {/* 中文意思 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  📖 中文意思
                </h3>
                <div className="text-5xl font-bold text-blue-700 mb-4">
                  {currentWord.meaning}
                </div>
              </div>

              {/* 谐音记忆 */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                  🎵 谐音记忆
                </h3>
                <div className="text-4xl font-bold text-yellow-700 mb-4">
                  "{currentWord.mnemonic}"
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    {currentWord.explanation}
                  </p>
                </div>
              </div>

              {/* 记忆反馈 */}
              <div className="text-center">
                <h4 className="text-2xl font-bold text-gray-800 mb-6">
                  你学会这个单词了吗？
                </h4>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => handleRemembered(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 text-xl shadow-lg"
                  >
                    ✅ 学会了
                  </button>
                  <button
                    onClick={() => handleRemembered(false)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 text-xl shadow-lg"
                  >
                    📚 没记住
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={getRandomWord}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg shadow-lg"
            >
              🎲 换一个单词
            </button>
            <button
              onClick={resetStats}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg shadow-lg"
            >
              🔄 重置统计
            </button>
          </div>
          
          <div className="text-gray-500 text-lg">
            <p>💡 提示：利用中文谐音联想，让记单词变得更有趣！</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordMemory
