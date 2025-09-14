import { useState, useEffect } from 'react'
import { type Conversation, type ConversationStatus } from './ConversationList'
import SuggestionCard from './SuggestionCard'
import ChatInput from './ChatInput'
import { ArrowLeft, Circle, Clock, Check, ChevronDown } from 'lucide-react'

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
  onUpdateStatus: (conversationId: string, newStatus: ConversationStatus) => void
}

export default function ConversationView({ conversation, onGoBack, onUpdateStatus }: ConversationViewProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [hasSuggestionsGenerated, setHasSuggestionsGenerated] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const getStatusIcon = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return <Circle className="h-3 w-3" style={{ width: '0.75rem', height: '0.75rem' }} />
      case 'follow-up': return <Clock className="h-3 w-3" style={{ width: '0.75rem', height: '0.75rem' }} />
      case 'closed': return <Check className="h-3 w-3" style={{ width: '0.75rem', height: '0.75rem' }} />
    }
  }

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return { bg: '#10b981', text: '#1c1c1c' }
      case 'follow-up': return { bg: '#f59e0b', text: '#1c1c1c' }
      case 'closed': return { bg: '#6b7280', text: '#1c1c1c' }
    }
  }

  const getStatusLabel = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return 'Active'
      case 'follow-up': return 'Follow Up'
      case 'closed': return 'Closed'
    }
  }

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
    <div className="flex flex-col h-full">
      {/* Header with red background */}
      <div 
        className="bg-primary text-primary-foreground p-4 flex items-center gap-3 flex-shrink-0"
        style={{ 
          backgroundColor: '#ed1c24', 
          color: '#ffffff', 
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexShrink: 0
        }}
      >
        <button 
          onClick={onGoBack}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft className="h-4 w-4 mr-1" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
          Back
        </button>
        <h2 
          className="text-lg font-semibold"
          style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600',
            margin: 0,
            flex: 1
          }}
        >
          {conversation.senderName}
        </h2>
        
        {/* Status Management Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            style={{
              backgroundColor: '#ffffff',
              color: '#1c1c1c',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
            }}
          >
            {getStatusIcon(conversation.status)}
            {getStatusLabel(conversation.status)}
            <ChevronDown style={{ width: '0.75rem', height: '0.75rem' }} />
          </button>
          
          {/* Status Dropdown */}
          {showStatusDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                zIndex: 10,
                minWidth: '150px'
              }}
            >
              {(['active', 'follow-up', 'closed'] as ConversationStatus[]).map((status) => {
                const statusColor = getStatusColor(status)
                const isCurrentStatus = conversation.status === status
                return (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateStatus(conversation.id, status)
                      setShowStatusDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'none',
                      backgroundColor: isCurrentStatus ? '#f5f5f5' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      borderRadius: status === 'active' ? '0.5rem 0.5rem 0 0' : 
                                  status === 'closed' ? '0 0 0.5rem 0.5rem' : '0'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrentStatus) {
                        e.currentTarget.style.backgroundColor = '#f9f9f9'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrentStatus) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: statusColor.bg,
                        color: '#ffffff',
                        borderRadius: '50%',
                        width: '1rem',
                        height: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getStatusIcon(status)}
                    </div>
                    <span style={{ color: '#1c1c1c' }}>
                      {getStatusLabel(status)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Messages and suggestions */}
      <div 
        className="flex-1 relative"
        style={{ 
          flex: 1, 
          position: 'relative' 
        }}
      >
        <div 
          style={{ 
            height: '100%', 
            overflowY: 'auto',
            padding: '1rem' 
          }}
        >
          {/* Messages */}
          <div style={{ marginBottom: '1.5rem' }}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                style={{
                  marginBottom: '1rem',
                  maxWidth: '80%',
                  marginLeft: message.isUser ? 'auto' : '0',
                  marginRight: message.isUser ? '0' : 'auto',
                  backgroundColor: message.isUser ? '#ed1c24' : '#f5f5f5',
                  color: message.isUser ? '#ffffff' : '#1c1c1c',
                  borderRadius: '0.5rem',
                  padding: '0.75rem'
                }}
              >
                <p style={{ 
                  fontSize: '0.875rem', 
                  lineHeight: '1.6',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  {message.text}
                </p>
                <span style={{ 
                  fontSize: '0.75rem', 
                  opacity: 0.7,
                  display: 'block'
                }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          {/* Generate suggestions button */}
          {!hasSuggestionsGenerated && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <button 
                onClick={generateSuggestions}
                style={{
                  backgroundColor: '#ed1c24',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d91920'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ed1c24'}
              >
                Generate Initial Suggestions
              </button>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 
                style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1c1c1c',
                  marginBottom: '1rem',
                  margin: '0 0 1rem 0'
                }}
              >
                Suggested Responses
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
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

      {/* Chat input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}