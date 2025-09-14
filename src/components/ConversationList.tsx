import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'

export type ConversationStatus = 'active' | 'follow-up' | 'closed'

export interface Conversation {
  id: string
  senderName: string
  lastMessage: string
  timestamp: Date
  status: ConversationStatus
}

interface ConversationListProps {
  conversations: Conversation[]
  onSelectConversation: (conversation: Conversation) => void
}

type FilterStatus = 'all' | ConversationStatus

export default function ConversationList({ conversations, onSelectConversation }: ConversationListProps) {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    const counts = {
      all: conversations.length,
      active: conversations.filter(c => c.status === 'active').length,
      'follow-up': conversations.filter(c => c.status === 'follow-up').length,
      closed: conversations.filter(c => c.status === 'closed').length
    }
    return counts
  }, [conversations])

  // Filter and search logic
  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      // Status filter
      const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter

      // Search filter
      const matchesSearch = searchText === '' ||
        conversation.senderName.toLowerCase().includes(searchText.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(searchText.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [conversations, searchText, statusFilter])

  const clearSearch = () => setSearchText('')

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return { bg: '#10b981', text: '#ffffff' } // Green
      case 'follow-up': return { bg: '#f59e0b', text: '#ffffff' } // Orange
      case 'closed': return { bg: '#6b7280', text: '#ffffff' } // Gray
    }
  }

  const getStatusLabel = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return 'Active'
      case 'follow-up': return 'Follow Up'
      case 'closed': return 'Closed'
    }
  }

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
          Search and filter conversations below
        </p>
      </div>

      {/* Search Bar */}
      <div 
        style={{ 
          padding: '1rem', 
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              width: '1rem', 
              height: '1rem', 
              color: '#6b7280'
            }} 
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search conversations..."
            style={{
              width: '100%',
              padding: '0.75rem 2.5rem 0.75rem 2.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
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
          {searchText && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0.25rem'
              }}
            >
              <X style={{ width: '1rem', height: '1rem' }} />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div 
        style={{ 
          padding: '0.5rem 1rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'active', 'follow-up', 'closed'] as const).map((filter) => {
            const isActive = statusFilter === filter
            const count = statusCounts[filter]
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                style={{
                  backgroundColor: isActive ? '#ed1c24' : '#f5f5f5',
                  color: isActive ? '#ffffff' : '#4a4a4a',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#e5e5e5'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5'
                  }
                }}
              >
                <span>{filter === 'all' ? 'All' : getStatusLabel(filter as ConversationStatus)}</span>
                <span
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '0.375rem',
                    padding: '0.125rem 0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    minWidth: '1.25rem',
                    textAlign: 'center'
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Conversations list */}
      <div 
        className="flex-1"
        style={{ 
          flex: 1, 
          overflowY: 'auto',
          height: 'calc(100vh - 220px)'
        }}
      >
        <div style={{ padding: '0.5rem' }}>
          {filteredConversations.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                {searchText ? 'No conversations match your search.' : 'No conversations found.'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const statusColor = getStatusColor(conversation.status)
              return (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <h3 
                      className="font-semibold text-foreground"
                      style={{ 
                        fontWeight: '600', 
                        color: '#1c1c1c',
                        margin: 0,
                        flex: 1
                      }}
                    >
                      {conversation.senderName}
                    </h3>
                    <span 
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontWeight: '500'
                      }}
                    >
                      {getStatusLabel(conversation.status)}
                    </span>
                  </div>
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
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}