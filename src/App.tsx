import { useState } from 'react'
import ConversationList, { type Conversation, type ConversationStatus } from './components/ConversationList'
import ConversationView from './components/ConversationView'
import { useConversations, useUpdateConversationStatus } from './server/conversations/queries'
import type { ConversationRow } from './server/conversations/api/types'

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'conversation'>('list')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  // Use real Supabase data instead of mock data
  const { data: conversationsData, isLoading, error, fetchNextPage, hasNextPage } = useConversations({})
  const updateConversationStatusMutation = useUpdateConversationStatus()

  // Transform Supabase data to match UI component interface
  const conversations: Conversation[] = conversationsData?.pages.flat().map((conv: ConversationRow) => ({
    id: conv.thread_id,
    senderName: conv.display_name || 'Unknown Contact',
    lastMessage: conv.summary || 'No summary available',
    timestamp: new Date(conv.updated_at),
    status: conv.conversation_status  as ConversationStatus 
  })) ?? []

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setCurrentView('conversation')
  }

  const handleGoBack = () => {
    setCurrentView('list')
    setSelectedConversation(null)
  }

  const updateConversationStatus = (conversationId: string, newStatus: ConversationStatus) => {
    // Convert UI status back to API format

    updateConversationStatusMutation.mutate(
      { threadId: conversationId, status: newStatus as ConversationRow['conversation_status'] },
      {
        onSuccess: (updatedConversation) => {
          // Update selected conversation if it's the one being updated
          if (selectedConversation?.id === conversationId) {
            setSelectedConversation(prev =>
              prev ? {
                ...prev,
                status: updatedConversation.conversation_status as ConversationStatus
              } : null
            )
          }
        }
      }
    )
  }

  return (
    <div 
      className="w-full h-screen overflow-hidden bg-background font-sans"
      style={{ 
        width: '100%', 
        height: '100vh', 
        overflow: 'hidden', 
        backgroundColor: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {currentView === 'list' ? (
        <ConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoading}
          error={error}
          onLoadMore={() => hasNextPage && fetchNextPage()}
          hasMore={hasNextPage}
        />
      ) : (
        selectedConversation && (
          <ConversationView
            conversation={selectedConversation}
            onGoBack={handleGoBack}
            onUpdateStatus={updateConversationStatus}
          />
        )
      )}
    </div>
  )
}

export default App
