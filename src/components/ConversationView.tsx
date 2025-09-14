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
  responseType: 'discovery' | 'qualify' | 'offer'
  rationale: string
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
        text: "Thank you for your interest! I'd love to schedule a quick call to discuss how we can help with your specific needs.",
        responseType: 'discovery',
        rationale: "This response aims to gather more information about the prospect's needs and challenges through a discovery call"
      },
      {
        id: '2',
        text: "I understand your concerns. Let me address each point and show you the value proposition our solution offers.",
        responseType: 'qualify',
        rationale: "This response qualifies the prospect by addressing objections and demonstrating value to determine purchase readiness"
      },
      {
        id: '3',
        text: "Based on what you've shared, I think our premium solution would be perfect for your business requirements.",
        responseType: 'offer',
        rationale: "This response presents a specific solution recommendation based on the prospect's stated requirements"
      },
      {
        id: '4',
        text: "I appreciate you taking the time to evaluate our service. Would you like me to prepare a customized demo for your team?",
        responseType: 'discovery',
        rationale: "This response seeks to uncover decision-making process and stakeholders through a demo opportunity"
      }
    ]

    setSuggestions(mockSuggestions)
    setHasSuggestionsGenerated(true)
  }

  const generateCustomSuggestions = async (userInput: string) => {
    const input = userInput.toLowerCase()
    let customSuggestions: Suggestion[] = []

    if (input.includes('formal') || input.includes('professional')) {
      customSuggestions = [
        {
          id: 'formal-1',
          text: "Thank you for your inquiry. I would be pleased to arrange a formal consultation to discuss your requirements in detail.",
          responseType: 'discovery',
          rationale: "Professional tone focused on formal business engagement"
        },
        {
          id: 'formal-2',
          text: "I acknowledge your concerns and would like to provide a comprehensive analysis of how our solution addresses your specific business objectives.",
          responseType: 'qualify',
          rationale: "Formal response addressing concerns with professional language"
        }
      ]
    } else if (input.includes('short') || input.includes('brief') || input.includes('concise')) {
      customSuggestions = [
        {
          id: 'short-1',
          text: "Let's schedule a quick call to discuss your needs.",
          responseType: 'discovery',
          rationale: "Brief, direct approach to scheduling discovery call"
        },
        {
          id: 'short-2',
          text: "Happy to address your concerns. When can we talk?",
          responseType: 'qualify',
          rationale: "Concise response that moves toward qualification"
        }
      ]
    } else if (input.includes('discovery') || input.includes('questions') || input.includes('learn')) {
      customSuggestions = [
        {
          id: 'discovery-1',
          text: "I'd love to learn more about your current challenges. What's the biggest obstacle you're facing right now?",
          responseType: 'discovery',
          rationale: "Direct discovery question to uncover pain points"
        },
        {
          id: 'discovery-2',
          text: "To better understand your needs, could you tell me about your current process and where you see room for improvement?",
          responseType: 'discovery',
          rationale: "Open-ended discovery question about current state and desired improvements"
        }
      ]
    } else if (input.includes('offer') || input.includes('proposal') || input.includes('solution')) {
      customSuggestions = [
        {
          id: 'offer-1',
          text: "Based on what you've shared, I have the perfect solution for your business. Can I walk you through our premium package?",
          responseType: 'offer',
          rationale: "Direct offer presentation based on discovered needs"
        },
        {
          id: 'offer-2',
          text: "I'd like to propose a customized solution that addresses your specific requirements. Would you be interested in seeing a detailed proposal?",
          responseType: 'offer',
          rationale: "Formal solution proposal with customization emphasis"
        }
      ]
    } else {
      customSuggestions = [
        {
          id: 'custom-1',
          text: "Thank you for that insight. How can I best help you move forward with this?",
          responseType: 'discovery',
          rationale: "Generic response that seeks to understand next steps"
        },
        {
          id: 'custom-2',
          text: "I appreciate you sharing that with me. What would be the most valuable next step for you?",
          responseType: 'qualify',
          rationale: "Follow-up response that qualifies next steps and interest level"
        },
        {
          id: 'custom-3',
          text: "That's exactly what our solution is designed to address. Would you like to see how it works?",
          responseType: 'offer',
          rationale: "Generic solution-focused response with demonstration offer"
        }
      ]
    }

    setSuggestions(prev => [...prev, ...customSuggestions])
    setHasSuggestionsGenerated(true)
  }

  const handleSendMessage = (messageText: string) => {
    generateCustomSuggestions(messageText)
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

      {/* Messages only */}
      <div
        className="flex-1 relative"
        style={{
          flex: 1,
          position: 'relative',
          minHeight: 0,
          maxHeight: '100%',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
            padding: '1rem',
            boxSizing: 'border-box',
            position: 'relative'
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
        </div>
      </div>

      {/* Bottom section with Chat input and Suggestions */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '60vh'
        }}
      >
        {/* Chat input */}
        <ChatInput onSendMessage={handleSendMessage} />

        {/* Suggestions section */}
        {suggestions.length > 0 && (
          <div
            style={{
              borderTop: '1px solid #e5e5e5',
              backgroundColor: '#f9f9f9',
              flex: 1,
              overflowY: 'auto',
              minHeight: 0
            }}
          >
            <div style={{ padding: '1rem' }}>
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
                    responseType={suggestion.responseType}
                    rationale={suggestion.rationale}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}