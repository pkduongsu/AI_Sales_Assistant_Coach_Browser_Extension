import { useState, useRef } from 'react'
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
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top')
  const buttonRef = useRef<HTMLButtonElement>(null)

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

  const determineTooltipPosition = () => {
    if (!buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    // If button is in the top third of the viewport, show tooltip below
    // Otherwise show it above
    if (buttonRect.top < viewportHeight / 3) {
      setTooltipPosition('bottom')
    } else {
      setTooltipPosition('top')
    }
  }

  const handleMouseEnter = () => {
    determineTooltipPosition()
    setShowTooltip(true)
  }

  return (
    <div
      className="bg-gray-100 border border-gray-200 rounded-lg transition-colors hover:border-red-600"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">

          {/* Response Type Button with Tooltip */}
          <div style={{ position: 'relative' }}>
            <button
              ref={buttonRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setShowTooltip(false)}
              style={{
                backgroundColor: getResponseTypeColor(responseType).bg,
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                padding: 'var(--space-xs) var(--space-md)',
                fontSize: 'var(--text-xs)',
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
                  ...(tooltipPosition === 'top' ? {
                    bottom: '100%',
                    marginBottom: 'var(--space-sm)',
                  } : {
                    top: '100%',
                    marginTop: 'var(--space-sm)',
                  }),
                  left: '0',
                  backgroundColor: '#1c1c1c',
                  color: '#ffffff',
                  padding: 'var(--space-sm) var(--space-md)',
                  borderRadius: '0.375rem',
                  fontSize: 'var(--text-xs)',
                  width: 'max-content',
                  maxWidth: 'clamp(250px, 50vw, 350px)',
                  minWidth: 'clamp(150px, 30vw, 200px)',
                  whiteSpace: 'normal',
                  lineHeight: '1.4',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  zIndex: 10,
                  wordWrap: 'break-word'
                }}
              >
                {rationale}
                {/* Arrow pointing to the button */}
                <div
                  style={{
                    position: 'absolute',
                    ...(tooltipPosition === 'top' ? {
                      top: '100%',
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #1c1c1c'
                    } : {
                      bottom: '100%',
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid #1c1c1c'
                    }),
                    left: 'var(--space-lg)',
                    width: '0',
                    height: '0'
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
              padding: 'var(--space-xs) var(--space-md)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.2s',
              minHeight: 'calc(var(--button-height) * 0.7)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3 mr-1" style={{ width: 'var(--text-xs)', height: 'var(--text-xs)', marginRight: 'var(--space-xs)' }} />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" style={{ width: 'var(--text-xs)', height: 'var(--text-xs)', marginRight: 'var(--space-xs)' }} />
                Copy
              </>
            )}
          </button>
        </div>
        <p
          style={{
            fontSize: 'var(--text-sm)',
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