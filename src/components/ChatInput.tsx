import { useState } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  return (
    <div
      style={{
        borderTop: '1px solid #e5e5e5',
        backgroundColor: '#ffffff',
        padding: 'var(--space-lg)',
        flexShrink: 0
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Refine suggestions or add specific requests..."
          style={{
            flex: 1,
            minHeight: 'var(--input-height)',
            padding: 'var(--space-md)',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: 'var(--text-sm)',
            fontFamily: 'inherit',
            outline: 'none',
            minWidth: '200px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ed1c24'
            e.target.style.boxShadow = '0 0 0 2px rgba(237, 28, 36, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          style={{
            backgroundColor: !message.trim() ? '#9ca3af' : '#ed1c24',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            padding: 'var(--space-md) var(--space-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            cursor: !message.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s',
            minHeight: 'var(--button-height)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (message.trim()) {
              e.currentTarget.style.backgroundColor = '#d91920'
            }
          }}
          onMouseLeave={(e) => {
            if (message.trim()) {
              e.currentTarget.style.backgroundColor = '#ed1c24'
            }
          }}
        >
          <Send className="h-4 w-4 mr-1" style={{ width: 'var(--text-base)', height: 'var(--text-base)', marginRight: 'var(--space-xs)' }} />
          Send
        </button>
      </form>
    </div>
  )
}