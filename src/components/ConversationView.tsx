import { useState, useEffect } from 'react'
import { type Conversation } from './ConversationList'
import SuggestionCard from './SuggestionCard'
import ChatInput from './ChatInput'

export interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export interface Suggestion {
  id: string
  text: string
}

interface ConversationViewProps {
  conversation: Conversation
  onGoBack: () => void
}

export default function ConversationView({ conversation, onGoBack }: ConversationViewProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [hasSuggestionsGenerated, setHasSuggestionsGenerated] = useState(false)

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: conversation.lastMessage,
        isUser: false,
        timestamp: conversation.timestamp
      }
    ])
    setSuggestions([])
    setHasSuggestionsGenerated(false)
  }, [conversation])

  const generateSuggestions = async () => {
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        text: "Thank you for your interest! I'd love to schedule a quick call to discuss how we can help with your specific needs."
      },
      {
        id: '2', 
        text: "I understand your concerns. Let me address each point and show you the value proposition our solution offers."
      },
      {
        id: '3',
        text: "Based on what you've shared, I think our premium solution would be perfect for your business requirements."
      },
      {
        id: '4',
        text: "I appreciate you taking the time to evaluate our service. Would you like me to prepare a customized demo for your team?"
      }
    ]
    
    setSuggestions(mockSuggestions)
    setHasSuggestionsGenerated(true)
  }

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  return (
    <div className="conversation-view">
      <div className="conversation-header">
        <button onClick={onGoBack} className="back-btn">
          ← Back
        </button>
        <h2 className="conversation-title">{conversation.senderName}</h2>
      </div>

      <div className="conversation-content">
        <div className="scrollable-content">
          <div className="messages-container">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isUser ? 'user-message' : 'other-message'}`}
              >
                <p>{message.text}</p>
                <span className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          {!hasSuggestionsGenerated && (
            <div className="generate-suggestions-container">
              <button 
                onClick={generateSuggestions}
                className="generate-suggestions-btn"
              >
                Generate Initial Suggestions
              </button>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="suggestions-container">
              <h3>Suggested Responses</h3>
              <div className="suggestions-grid">
                {suggestions.map((suggestion) => (
                  <SuggestionCard 
                    key={suggestion.id}
                    suggestion={suggestion.text}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}