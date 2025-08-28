import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import CameraCapture from './components/CameraCapture'
import HistoryPage from './components/HistoryPage'
import ResourcesPage from './components/ResourcesPage'
import SettingsPage from './components/SettingsPage'
import { getEmotionHistory } from './lib/emotionAnalysis'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [emotionHistory, setEmotionHistory] = useState([])
  const [lastEmotion, setLastEmotion] = useState(null)

  // Carrega o histórico de emoções ao inicializar
  useEffect(() => {
    const history = getEmotionHistory()
    setEmotionHistory(history)
    if (history.length > 0) {
      setLastEmotion(history[0])
    }
  }, [])

  const handleEmotionCaptured = (newEmotion) => {
    setLastEmotion(newEmotion)
    setEmotionHistory(prev => [newEmotion, ...prev])
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} lastEmotion={lastEmotion} />
      case 'capture':
        return <CameraCapture onPageChange={setCurrentPage} onEmotionCaptured={handleEmotionCaptured} />
      case 'history':
        return <HistoryPage onPageChange={setCurrentPage} emotionHistory={emotionHistory} />
      case 'resources':
        return <ResourcesPage onPageChange={setCurrentPage} lastEmotion={lastEmotion} />
      case 'settings':
        return <SettingsPage onPageChange={setCurrentPage} />
      default:
        return <HomePage onPageChange={setCurrentPage} lastEmotion={lastEmotion} />
    }
  }

  return (
    <div className="mobile-container">
      {renderPage()}
      {currentPage !== 'capture' && (
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
    </div>
  )
}

export default App

