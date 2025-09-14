import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

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
    <div 
      style={{
        backgroundColor: '#f5f5f5',
        border: '1px solid #e5e5e5',
        borderRadius: '0.5rem',
        transition: 'border-color 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ed1c24'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
    >
      <div style={{ padding: '1rem' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginBottom: '0.75rem' 
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3 mr-1" style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                Copy
              </>
            )}
          </button>
        </div>
        <p 
          style={{ 
            fontSize: '0.875rem', 
            color: '#1c1c1c',
            lineHeight: '1.6',
            margin: 0
          }}
        >
          {suggestion}
        </p>
      </div>
    </div>
  )
}