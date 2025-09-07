import { useState } from 'react'
import ConversationList, { type Conversation } from './components/ConversationList'
import ConversationView from './components/ConversationView'
import './App.css'

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
    <div className="sales-assistant">
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
