import { useState } from 'react'
import ConversationList, { type Conversation } from './components/ConversationList'
import ConversationView from './components/ConversationView'

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'conversation'>('list')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setCurrentView('conversation')
  }

  const handleGoBack = () => {
    setCurrentView('list')
    setSelectedConversation(null)
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
        <ConversationList onSelectConversation={handleSelectConversation} />
      ) : (
        selectedConversation && (
          <ConversationView 
            conversation={selectedConversation}
            onGoBack={handleGoBack}
          />
        )
      )}
    </div>
  )
}

export default App
