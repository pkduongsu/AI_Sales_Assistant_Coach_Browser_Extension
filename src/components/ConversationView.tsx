import { useState, useEffect, useRef } from 'react'
import { type Conversation, type ConversationStatus } from './ConversationList'
import SuggestionCard from './SuggestionCard'
import ChatInput from './ChatInput'
import { ArrowLeft, Circle, Clock, Check, ChevronDown } from 'lucide-react'
import { useMessages } from '../server/messages/queries'
import type { MessageRow } from '../server/messages/api/listMessages'
import { useSuggestion } from '../server/suggestions/queries'
import { type Suggestion as APISuggestion } from '../server/suggestions/api/getSuggestion'

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

export interface UserMessage {
  id: string
  text: string
  timestamp: Date
}

interface ConversationViewProps {
  conversation: Conversation
  onGoBack: () => void
  onUpdateStatus: (conversationId: string, newStatus: ConversationStatus) => void
}

// Helper function to map API suggestions to UI format
function mapAPIToUISuggestions(apiSuggestions: APISuggestion[]): Suggestion[] {
  console.log('Mapping API suggestions to UI format:', apiSuggestions);

  if (!Array.isArray(apiSuggestions)) {
    console.warn('Invalid apiSuggestions format:', apiSuggestions);
    return [];
  }

  const mapped = apiSuggestions.map(apiSuggestion => {
    if (!apiSuggestion) {
      console.warn('Null/undefined suggestion found');
      return null;
    }

    return {
      id: apiSuggestion.id || 'unknown',
      text: apiSuggestion.message || '',
      responseType: apiSuggestion.type || 'discovery',
      rationale: apiSuggestion.rationale || ''
    };
  }).filter(Boolean) as Suggestion[];

  console.log('Mapped suggestions:', mapped);
  return mapped;
}

export default function ConversationView({ conversation, onGoBack, onUpdateStatus }: ConversationViewProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [userMessages, setUserMessages] = useState<UserMessage[]>([])
  const [hasSuggestionsGenerated, setHasSuggestionsGenerated] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement | null>(null)

  // Use real message data from Supabase
  const { data: messagesData, isLoading: messagesLoading, error: messagesError } = useMessages(conversation.id)

  // Use real suggestions data from API
  const { data: suggestionsResponse, isLoading: suggestionsLoading, error: suggestionsError } = useSuggestion(
    shouldFetchSuggestions ? conversation.id : ""
  )

  // Transform Supabase message data to UI format
  const messages: Message[] = messagesData?.map((msg: MessageRow) => ({
    id: msg.mid,
    text: msg.text,
    isUser: msg.role === 'user',
    timestamp: new Date(msg.ts)
  })) ?? []

  const getStatusIcon = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return <Circle className="h-3 w-3" style={{ width: '0.75rem', height: '0.75rem' }} />
      case 'follow up': return <Clock className="h-3 w-3" style={{ width: '0.75rem', height: '0.75rem' }} />
      case 'closed': return <Check className="h-3 w-3" style={{ width: '0.75rem', height: '0.75rem' }} />
    }
  }

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return { bg: '#10b981', text: '#1c1c1c' }
      case 'follow up': return { bg: '#f59e0b', text: '#1c1c1c' }
      case 'closed': return { bg: '#6b7280', text: '#1c1c1c' }
    }
  }

  const getStatusLabel = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return 'Active'
      case 'follow up': return 'Follow Up'
      case 'closed': return 'Closed'
    }
  }

  useEffect(() => {
    setSuggestions([])
    setUserMessages([])
    setHasSuggestionsGenerated(false)
    setShouldFetchSuggestions(false)
  }, [conversation])

  // Handle suggestions API response
  useEffect(() => {
    if (suggestionsResponse && suggestionsResponse.length > 0) {
      console.log('Processing suggestions response:', suggestionsResponse);

      // Get the first response item (should contain all suggestions)
      const responseData = suggestionsResponse[0];
      console.log('Response data:', responseData);

      // Extract all suggestions directly (no filtering by thread_id needed)
      const apiSuggestions = responseData.suggestions || [];
      console.log('All API suggestions:', apiSuggestions);

      if (apiSuggestions.length > 0) {
        const uiSuggestions = mapAPIToUISuggestions(apiSuggestions);
        console.log('Mapped UI suggestions:', uiSuggestions);
        setSuggestions(uiSuggestions);
        setHasSuggestionsGenerated(true);
      }
      setShouldFetchSuggestions(false); // Reset the fetch trigger after processing
    }
  }, [suggestionsResponse, conversation.id])

  // Handle API errors - reset fetch trigger so user can retry
  useEffect(() => {
    if (suggestionsError) {
      setShouldFetchSuggestions(false)
    }
  }, [suggestionsError])

  const generateSuggestions = () => {
    setShouldFetchSuggestions(true)
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
    // Add user message to suggestion context
    const newUserMessage: UserMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      timestamp: new Date()
    }
    setUserMessages(prev => [...prev, newUserMessage])

    // Generate suggestions based on the message
    generateCustomSuggestions(messageText)
  }

  useEffect(() => {
    const el = suggestionsRef.current
    if (!el || (suggestions.length === 0 && userMessages.length === 0)) return

    // Use setTimeout to ensure DOM has fully updated and content has rendered
    setTimeout(() => {
      if (el) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [suggestions, userMessages])

  return (
    <div className="flex flex-col min-h-0" style={{ height: '100dvh' }}>
      {/* Header with red background */}
      <div
        className="bg-red-600 text-white flex items-center gap-3 flex-shrink-0 p-4 min-h-16"
      >
        <button
          onClick={onGoBack}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            padding: 'var(--space-sm)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: 'var(--text-sm)',
            transition: 'background-color 0.2s',
            minHeight: 'var(--button-height)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft className="h-4 w-4 mr-1" style={{ width: 'var(--text-base)', height: 'var(--text-base)', marginRight: 'var(--space-xs)' }} />
          Back
        </button>
        <h2
          className="font-semibold"
          style={{
            fontSize: 'var(--text-lg)',
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
              padding: 'var(--space-sm) var(--space-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              minHeight: 'var(--button-height)'
            }}
          >
            {getStatusIcon(conversation.status)}
            {getStatusLabel(conversation.status)}
            <ChevronDown style={{ width: 'var(--text-xs)', height: 'var(--text-xs)' }} />
          </button>
          
          {/* Status Dropdown */}
          {showStatusDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 'var(--space-sm)',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                zIndex: 10,
                minWidth: 'clamp(120px, 30vw, 180px)'
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
                      padding: 'var(--space-md)',
                      border: 'none',
                      backgroundColor: isCurrentStatus ? '#f5f5f5' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-sm)',
                      fontSize: 'var(--text-sm)',
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
                        width: 'var(--text-base)',
                        height: 'var(--text-base)',
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

      {/* Two-section layout with simple CSS */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
        {/* Chat History Section */}
        <div
          style={{
            flex: '0 0 200px',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 'var(--space-lg)',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Messages */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            {messagesLoading ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-2xl)',
                color: '#6b7280'
              }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Loading messages...</p>
              </div>
            ) : messagesError ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-2xl)',
                color: '#dc2626'
              }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Error loading messages: {messagesError.message}</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-2xl)',
                color: '#6b7280'
              }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>No messages in this conversation yet.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: 'var(--space-lg)',
                    maxWidth: 'clamp(250px, 80%, 400px)',
                    marginLeft: message.isUser ? 'auto' : '0',
                    marginRight: message.isUser ? '0' : 'auto',
                    backgroundColor: message.isUser ? '#0A7CFF' : '#f5f5f5',
                    color: message.isUser ? '#ffffff' : '#1c1c1c',
                    borderRadius: '0.5rem',
                    padding: 'var(--card-padding)'
                  }}
                >
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.6',
                    margin: 0,
                    marginBottom: 'var(--space-xs)'
                  }}>
                    {message.text}
                  </p>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    opacity: 0.7,
                    display: 'block'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Generate suggestions button */}
          {!hasSuggestionsGenerated && !messagesLoading && messages.length > 0 && (
            <div style={{ textAlign: 'center', margin: 'var(--space-2xl) 0' }}>
              <button
                onClick={generateSuggestions}
                disabled={suggestionsLoading}
                style={{
                  backgroundColor: suggestionsLoading ? '#9ca3af' : '#ed1c24',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: 'var(--space-md) var(--space-xl)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  cursor: suggestionsLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  minHeight: 'var(--button-height)'
                }}
                onMouseEnter={(e) => {
                  if (!suggestionsLoading) {
                    e.currentTarget.style.backgroundColor = '#d91920'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!suggestionsLoading) {
                    e.currentTarget.style.backgroundColor = '#ed1c24'
                  }
                }}
              >
                {suggestionsLoading ? 'Generating Suggestions...' : 'Generate Initial Suggestions'}
              </button>

              {/* Error message */}
              {suggestionsError && (
                <div style={{
                  marginTop: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: '0.375rem',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid #fecaca'
                }}>
                  <p style={{ margin: 0, marginBottom: 'var(--space-xs)' }}>
                    Failed to generate suggestions: {suggestionsError.message}
                  </p>
                  <button
                    onClick={() => {
                      setShouldFetchSuggestions(false)
                      setTimeout(() => generateSuggestions(), 100)
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      border: '1px solid #dc2626',
                      borderRadius: '0.25rem',
                      padding: 'var(--space-xs) var(--space-sm)',
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input & Suggestions Section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9f9f9',
            borderTop: '2px solid #e5e5e5'
          }}
        >
          {/* Chat input at top */}
          <div style={{ flexShrink: 0 }}>
            <ChatInput onSendMessage={handleSendMessage} />
          </div>

          {/* Suggestions section - always present, scrollable */}
          <div
            className="flex-1 border-t border-gray-200 flex flex-col"
            style={{
              height: 0,
              minHeight: 0,
              maxHeight: '100%'
            }}
          >
            {(suggestions.length > 0 || userMessages.length > 0) ? (
              <>
                {/* Header - fixed */}
                <div className="p-4 pb-0 flex-shrink-0">
                  <h3
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: '#1c1c1c',
                      margin: `0 0 var(--space-lg) 0`
                    }}
                  >
                    {userMessages.length > 0 ? 'Conversation & Suggestions' : 'Suggested Responses'}
                  </h3>
                </div>
                {/* Scrollable content */}
                <div
                  ref={suggestionsRef}
                  style={{
                    flex: '1 1 0',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    padding: '0 1rem 1rem 1rem',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'auto',
                    scrollbarColor: '#888888 #f1f1f1',
                    maxHeight: 'calc(100vh - 350px)'
                  }}
                >
                  <div className="flex flex-col gap-4">
                    {/* Display user messages */}
                    {userMessages.map((userMessage) => (
                      <div
                        key={userMessage.id}
                        style={{
                          marginBottom: 'var(--space-sm)',
                          maxWidth: 'clamp(200px, 90%, 350px)',
                          marginLeft: 'auto',
                          marginRight: '0',
                          backgroundColor: '#ed1c24',
                          color: '#ffffff',
                          borderRadius: '0.5rem',
                          padding: 'var(--card-padding)'
                        }}
                      >
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          lineHeight: '1.6',
                          margin: 0,
                          marginBottom: 'var(--space-xs)'
                        }}>
                          {userMessage.text}
                        </p>
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          opacity: 0.8,
                          display: 'block'
                        }}>
                          You • {userMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}

                    {/* Display suggestions after user messages */}
                    {suggestions.length > 0 && (
                      <>
                        {userMessages.length > 0 && (
                          <div style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: '600',
                            color: '#6b7280',
                            margin: 'var(--space-lg) 0 var(--space-sm) 0',
                            textAlign: 'center'
                          }}>
                            Suggested Responses
                          </div>
                        )}
                        {suggestions.map((suggestion) => (
                          <SuggestionCard
                            key={suggestion.id}
                            suggestion={suggestion.text}
                            responseType={suggestion.responseType}
                            rationale={suggestion.rationale}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-lg)',
                color: '#6b7280',
                fontSize: 'var(--text-sm)',
                textAlign: 'center'
              }}>
                <p>Trò chuyện cùng AI để cải thiện câu trả lời phù hợp</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}