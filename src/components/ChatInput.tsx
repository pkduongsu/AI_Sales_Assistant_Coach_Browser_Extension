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
        padding: '1rem',
        flexShrink: 0
      }}
    >
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          alignItems: 'flex-end' 
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Refine suggestions or add specific requests..."
          style={{
            flex: 1,
            minHeight: '40px',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            outline: 'none'
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
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: !message.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s'
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
          <Send className="h-4 w-4 mr-1" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
          Send
        </button>
      </form>
    </div>
  )
}