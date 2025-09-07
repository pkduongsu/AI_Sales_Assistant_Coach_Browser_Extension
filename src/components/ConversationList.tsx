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
    <div className="conversation-list">
      <div className="header">
        <h1>Recent Conversations</h1>
        <p>Select a conversation to generate responses</p>
      </div>
      
      <div className="conversations">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className="conversation-item"
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="conversation-header">
              <h3 className="sender-name">{conversation.senderName}</h3>
              <span className="timestamp">{formatTimestamp(conversation.timestamp)}</span>
            </div>
            <p className="last-message">{conversation.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  )
}