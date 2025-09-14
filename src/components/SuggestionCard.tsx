import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export type ResponseType = 'discovery' | 'qualify' | 'offer'

interface SuggestionCardProps {
  suggestion: string
  responseType: ResponseType
  rationale: string
}

export default function SuggestionCard({ suggestion, responseType, rationale }: SuggestionCardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const getResponseTypeColor = (type: ResponseType) => {
    switch (type) {
      case 'discovery': return { bg: '#3b82f6', hover: '#2563eb' }
      case 'qualify': return { bg: '#f59e0b', hover: '#d97706' }
      case 'offer': return { bg: '#10b981', hover: '#059669' }
    }
  }

  const getResponseTypeLabel = (type: ResponseType) => {
    switch (type) {
      case 'discovery': return 'Discovery'
      case 'qualify': return 'Qualify'
      case 'offer': return 'Offer'
    }
  }

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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}
        >
          {/* Response Type Button with Tooltip */}
          <div style={{ position: 'relative' }}>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              style={{
                backgroundColor: getResponseTypeColor(responseType).bg,
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'default',
                transition: 'background-color 0.2s'
              }}
            >
              {getResponseTypeLabel(responseType)}
            </button>

            {/* Tooltip */}
            {showTooltip && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '0',
                  marginBottom: '0.5rem',
                  backgroundColor: '#1c1c1c',
                  color: '#ffffff',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  width: 'max-content',
                  maxWidth: '300px',
                  minWidth: '200px',
                  whiteSpace: 'normal',
                  lineHeight: '1.4',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  zIndex: 10,
                  wordWrap: 'break-word'
                }}
              >
                {rationale}
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '1rem',
                    width: '0',
                    height: '0',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #1c1c1c'
                  }}
                />
              </div>
            )}
          </div>

          {/* Copy Button */}
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