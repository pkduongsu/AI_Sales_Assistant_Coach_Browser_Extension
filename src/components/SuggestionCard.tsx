import { useState } from 'react'

interface SuggestionCardProps {
  suggestion: string
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestion)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <div className="suggestion-card">
      <div className="suggestion-header">
        <button 
          onClick={handleCopy}
          className="copy-btn"
        >
          {isCopied ? 'Copied!' : '📋'}
        </button>
      </div>
      <p className="suggestion-text">{suggestion}</p>
    </div>
  )
}