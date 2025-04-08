"use client"

import { useState } from "react"
import axios from "axios"
import { Loader2, Sparkles, Copy, Send, RefreshCw, ArrowLeft, Home } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const PostGenerator = () => {
  const [prompt, setPrompt] = useState("")
  const [generatedPost, setGeneratedPost] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const handleGeneratePost = async () => {
    if (!prompt.trim()) {
      setError("Please enter a topic or idea first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:4000/api/generate", { prompt })
      setGeneratedPost(response.data.post)
    } catch (error) {
      console.error("Error generating post:", error)
      setError("Failed to generate post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setPrompt("")
    setGeneratedPost("")
    setError("")
  }

  const handleGoBack = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={handleGoBack}
          className="group flex items-center text-indigo-700 hover:text-indigo-900 font-medium transition-all duration-300 transform hover:translate-x-[-5px]"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-10 w-10 text-white opacity-90" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Content Creator</h2>
          <p className="text-indigo-100 max-w-xl mx-auto">
            Transform your ideas into engaging, professional content with the power of artificial intelligence
          </p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <label htmlFor="prompt" className="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
              <span className="bg-indigo-100 p-1 rounded-md mr-2">
                <Sparkles className="h-4 w-4 text-indigo-700" />
              </span>
              What would you like to write about?
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your topic or idea... (e.g., 'Benefits of meditation', 'Top 5 travel destinations', etc.)"
                className="w-full p-4 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] bg-indigo-50 text-gray-800 placeholder-indigo-300 transition-all duration-300"
              />
              {error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md flex items-center">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={handleGeneratePost}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center shadow-md transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Generate Content
                </>
              )}
            </button>

            {prompt && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Reset
              </button>
            )}
          </div>

          {generatedPost && (
            <div className="mt-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-indigo-800 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-indigo-600" />
                  Your Generated Content
                </h3>
                <button
                  onClick={handleCopyToClipboard}
                  className={`px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center transform transition-all duration-300 hover:scale-105 active:scale-95 ${copied
                    ? "bg-green-100 text-green-700 focus:ring-green-500"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500"
                    }`}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-inner">
                <div className="generated-post whitespace-pre-line text-gray-800 leading-relaxed">{generatedPost}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alternative Back Button as Fixed Button */}
      <div className="fixed bottom-6 right-6">
        <Link
          to="/"
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-indigo-700 hover:text-indigo-900 hover:scale-110"
          aria-label="Go to home page"
        >
          <Home className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}

export default PostGenerator;

