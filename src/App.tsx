import { useState } from 'react'
import ConversationList, { type Conversation, type ConversationStatus } from './components/ConversationList'
import ConversationView from './components/ConversationView'

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'conversation'>('list')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  
  // Move conversation data to App level for shared state management
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      senderName: 'John Smith',
      lastMessage: 'I\'m interested in your premium package. Can we schedule a call?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2', 
      senderName: 'Sarah Johnson',
      lastMessage: 'Can you provide more details about pricing and implementation?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'follow-up'
    },
    {
      id: '3',
      senderName: 'Mike Chen',
      lastMessage: 'Thanks for the demo, I have some questions about integration...',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '4',
      senderName: 'Emily Davis',
      lastMessage: 'I need to discuss this with my team first. Will get back to you.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'follow-up'
    },
    {
      id: '5',
      senderName: 'Robert Wilson',
      lastMessage: 'Thanks for the proposal. We\'ve decided to go with another solution.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'closed'
    },
    {
      id: '6',
      senderName: 'Lisa Martinez',
      lastMessage: 'The contract looks good. When can we start the implementation?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'active'
    }
  ])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setCurrentView('conversation')
  }

  const handleGoBack = () => {
    setCurrentView('list')
    setSelectedConversation(null)
  }

  const updateConversationStatus = (conversationId: string, newStatus: ConversationStatus) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, status: newStatus }
          : conv
      )
    )
    
    // Update selected conversation if it's the one being updated
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => 
        prev ? { ...prev, status: newStatus } : null
      )
    }
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
