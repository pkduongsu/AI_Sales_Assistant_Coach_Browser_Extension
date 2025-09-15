import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'

export type ConversationStatus = 'active' | 'follow up' | 'closed'

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
  isLoading?: boolean
  error?: Error | null
  onLoadMore?: () => void
  hasMore?: boolean
}

type FilterStatus = 'all' | ConversationStatus

export default function ConversationList({
  conversations,
  onSelectConversation,
  isLoading,
  error,
  onLoadMore,
  hasMore
}: ConversationListProps) {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    const counts = {
      all: conversations.length,
      active: conversations.filter(c => c.status === 'active').length,
      'follow up': conversations.filter(c => c.status === 'follow up').length,
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
      case 'follow up': return { bg: '#f59e0b', text: '#ffffff' } // Orange
      case 'closed': return { bg: '#6b7280', text: '#ffffff' } // Gray
    }
  }

  const getStatusLabel = (status: ConversationStatus) => {
    switch (status) {
      case 'active': return 'Active'
      case 'follow up': return 'Follow Up'
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
        className="bg-primary text-primary-foreground flex-shrink-0"
        style={{
          backgroundColor: '#ed1c24',
          color: '#ffffff',
          padding: 'var(--space-lg)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-lg)',
          minHeight: 'var(--header-height)'
        }}
      >
        <img
          src={chrome.runtime.getURL('icons/CM_logo_48.png')}
          alt="App Logo"
          style={{
            flexShrink: 0,
            borderRadius: '50%'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            className="font-semibold"
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              margin: 0,
              marginBottom: 'var(--space-xs)'
            }}
          >
            Cuộc trò chuyện gần đây
          </h1>
          <p
            className="opacity-90"
            style={{
              fontSize: 'var(--text-sm)',
              opacity: '0.9',
              margin: 0
            }}
          >
            Hiển thị những cuộc trò chuyện gần nhất
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          padding: 'var(--space-lg)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search 
            style={{
              position: 'absolute',
              left: 'var(--space-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'var(--text-base)',
              height: 'var(--text-base)',
              color: '#6b7280'
            }} 
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm kiếm theo tên người nhắn / nội dung đoạn chat ..."
            style={{
              width: '100%',
              padding: 'var(--space-md) var(--space-2xl) var(--space-md) var(--space-2xl)',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              transition: 'border-color 0.2s',
              minHeight: 'var(--input-height)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ed1c24'
              e.target.style.boxShadow = '0 0 0 2px rgba(237, 28, 36, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.boxShadow = 'none'
            }}
            className="ml-1"
          />
          {searchText && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: 'var(--space-md)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: 'var(--space-xs)'
              }}
            >
              <X style={{ width: 'var(--text-base)', height: 'var(--text-base)' }} />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div
        style={{
          padding: 'var(--space-sm) var(--space-lg)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {(['all', 'active', 'follow up', 'closed'] as const).map((filter) => {
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
                  padding: 'var(--space-sm) var(--space-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  minHeight: 'var(--button-height)'
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
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: 'var(--text-xs)',
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
          minHeight: 0
        }}
      >
        <div style={{ padding: 'var(--space-sm)' }}>
          {isLoading && conversations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-2xl)',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Loading conversations...</p>
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-2xl)',
              color: '#dc2626'
            }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Error loading conversations: {error.message}</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-2xl)',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                {searchText ? 'No conversations match your search.' : 'No conversations found.'}
              </p>
            </div>
          ) : (
            <>
              {filteredConversations.map((conversation) => {
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
                marginBottom: 'var(--space-md)',
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
              <div style={{ padding: 'var(--card-padding)' }}>
                <div 
                  className="flex justify-between items-center mb-2"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-sm)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-xs)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flex: 1, minWidth: '200px' }}>
                    <h3
                      className="font-semibold text-foreground"
                      style={{
                        fontWeight: '600',
                        color: '#1c1c1c',
                        margin: 0,
                        flex: 1,
                        fontSize: 'var(--text-base)'
                      }}
                    >
                      {conversation.senderName}
                    </h3>
                    <span
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontSize: 'var(--text-xs)',
                        padding: 'var(--space-xs) var(--space-sm)',
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
                      fontSize: 'var(--text-xs)',
                      padding: 'var(--space-xs) var(--space-sm)',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {formatTimestamp(conversation.timestamp)}
                  </span>
                </div>
                <p
                  className="text-muted-foreground line-clamp-2 leading-relaxed"
                  style={{
                    fontSize: 'var(--text-sm)',
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
              })}

              {/* Load more button */}
              {hasMore && (
                <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                  <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    style={{
                      backgroundColor: '#ed1c24',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: 'var(--space-md) var(--space-xl)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s',
                      minHeight: 'var(--button-height)',
                      opacity: isLoading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#d91920'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#ed1c24'
                      }
                    }}
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}