import { useState } from 'react'

export interface Conversation {
  id: string
  senderName: string
  lastMessage: string
  timestamp: Date
}

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      senderName: 'John Smith',
      lastMessage: 'I\'m interested in your premium package...',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2', 
      senderName: 'Sarah Johnson',
      lastMessage: 'Can you provide more details about pricing?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      senderName: 'Mike Chen',
      lastMessage: 'Thanks for the demo, I have some questions...',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '4',
      senderName: 'Emily Davis',
      lastMessage: 'I need to discuss this with my team first',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ])

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with red background */}
      <div 
        className="bg-primary text-primary-foreground p-4 flex-shrink-0"
        style={{ 
          backgroundColor: '#ed1c24', 
          color: '#ffffff', 
          padding: '1rem',
          flexShrink: 0
        }}
      >
        <h1 
          className="text-xl font-semibold mb-1"
          style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '0.25rem' 
          }}
        >
          Recent Conversations
        </h1>
        <p 
          className="text-sm opacity-90"
          style={{ 
            fontSize: '0.875rem', 
            opacity: '0.9' 
          }}
        >
          Select a conversation to generate responses
        </p>
      </div>
      
      {/* Conversations list */}
      <div 
        className="flex-1"
        style={{ 
          flex: 1, 
          overflowY: 'auto',
          height: 'calc(100vh - 120px)'
        }}
      >
        <div style={{ padding: '0.5rem' }}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="mb-3 cursor-pointer transition-colors hover:bg-muted/50 hover:border-primary/20"
              onClick={() => onSelectConversation(conversation)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '0.5rem',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.borderColor = '#ed1c24'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.borderColor = '#e5e5e5'
              }}
            >
              <div style={{ padding: '1rem' }}>
                <div 
                  className="flex justify-between items-center mb-2"
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '0.5rem' 
                  }}
                >
                  <h3 
                    className="font-semibold text-foreground"
                    style={{ 
                      fontWeight: '600', 
                      color: '#1c1c1c',
                      margin: 0
                    }}
                  >
                    {conversation.senderName}
                  </h3>
                  <span 
                    className="text-xs"
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#4a4a4a',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {formatTimestamp(conversation.timestamp)}
                  </span>
                </div>
                <p 
                  className="text-sm text-muted-foreground line-clamp-2 leading-relaxed"
                  style={{ 
                    fontSize: '0.875rem', 
                    color: '#4a4a4a',
                    lineHeight: '1.6',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}