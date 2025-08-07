// Sistema de análise de emoções simulado
// Em um ambiente real, isso seria substituído por um modelo de IA treinado

import { savePrivateData, loadPrivateData } from './privacy'

const emotions = [
  {
    name: 'Calmo',
    emoji: '😌',
    description: 'Tranquilo e relaxado',
    level: 'Alto',
    color: '#7FB069',
    insights: [
      'Você está demonstrando sinais de tranquilidade',
      'Seu estado emocional parece equilibrado',
      'Continue mantendo essa serenidade'
    ]
  },
  {
    name: 'Feliz',
    emoji: '😊',
    description: 'Alegre e positivo',
    level: 'Alto',
    color: '#F4A261',
    insights: [
      'Você está irradiando positividade',
      'Sua expressão demonstra contentamento',
      'Que bom ver você assim!'
    ]
  },
  {
    name: 'Neutro',
    emoji: '😐',
    description: 'Estado emocional equilibrado',
    level: 'Médio',
    color: '#A8DADC',
    insights: [
      'Você parece estar em um estado neutro',
      'Talvez seja um bom momento para reflexão',
      'Considere fazer algo que te traga alegria'
    ]
  },
  {
    name: 'Pensativo',
    emoji: '🤔',
    description: 'Reflexivo e concentrado',
    level: 'Médio',
    color: '#C8B6E2',
    insights: [
      'Você parece estar refletindo sobre algo',
      'É importante dar tempo para seus pensamentos',
      'Lembre-se de ser gentil consigo mesmo'
    ]
  },
  {
    name: 'Preocupado',
    emoji: '😟',
    description: 'Ligeiramente ansioso',
    level: 'Baixo',
    color: '#E9ECEF',
    insights: [
      'Você parece um pouco preocupado',
      'Lembre-se de respirar profundamente',
      'Considere praticar alguns exercícios de relaxamento'
    ]
  }
]

// Simula a análise de uma imagem facial
export const analyzeEmotion = async (imageData) => {
  // Simula o tempo de processamento de IA
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
  
  // Seleciona uma emoção aleatória com pesos diferentes
  const weights = [0.4, 0.3, 0.15, 0.1, 0.05] // Favorece emoções mais positivas
  const random = Math.random()
  let cumulativeWeight = 0
  
  for (let i = 0; i < emotions.length; i++) {
    cumulativeWeight += weights[i]
    if (random <= cumulativeWeight) {
      return {
        ...emotions[i],
        confidence: 0.75 + Math.random() * 0.2, // Confiança entre 75-95%
        timestamp: new Date().toISOString(),
        analysis: {
          dominantEmotion: emotions[i].name,
          secondaryEmotions: getSecondaryEmotions(i),
          recommendations: getRecommendations(emotions[i])
        }
      }
    }
  }
  
  // Fallback para calmo
  return {
    ...emotions[0],
    confidence: 0.8,
    timestamp: new Date().toISOString(),
    analysis: {
      dominantEmotion: emotions[0].name,
      secondaryEmotions: [],
      recommendations: getRecommendations(emotions[0])
    }
  }
}

const getSecondaryEmotions = (primaryIndex) => {
  const secondary = []
  const availableEmotions = emotions.filter((_, index) => index !== primaryIndex)
  
  // Adiciona 1-2 emoções secundárias aleatórias
  const count = Math.random() > 0.5 ? 2 : 1
  for (let i = 0; i < count && i < availableEmotions.length; i++) {
    const randomIndex = Math.floor(Math.random() * availableEmotions.length)
    secondary.push(availableEmotions[randomIndex].name)
    availableEmotions.splice(randomIndex, 1)
  }
  
  return secondary
}

const getRecommendations = (emotion) => {
  const recommendations = {
    'Calmo': [
      'Continue mantendo essa tranquilidade',
      'Aproveite este momento de paz interior',
      'Considere praticar gratidão'
    ],
    'Feliz': [
      'Compartilhe essa alegria com alguém especial',
      'Aproveite este momento positivo',
      'Registre mentalmente o que te fez feliz'
    ],
    'Neutro': [
      'Que tal fazer algo que te traga alegria?',
      'Considere ouvir uma música relaxante',
      'Talvez seja um bom momento para meditar'
    ],
    'Pensativo': [
      'Dê tempo para seus pensamentos se organizarem',
      'Considere escrever sobre o que está pensando',
      'Lembre-se de ser gentil consigo mesmo'
    ],
    'Preocupado': [
      'Pratique exercícios de respiração',
      'Tente identificar a fonte da preocupação',
      'Considere conversar com alguém de confiança'
    ]
  }
  
  return recommendations[emotion.name] || recommendations['Neutro']
}

// Armazena dados de emoção localmente com privacidade
export const saveEmotionData = (emotionResult) => {
  try {
    const existingData = loadPrivateData('moodcapture_emotions') || []
    const newData = {
      id: Date.now(),
      ...emotionResult,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      time: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    existingData.push(newData)
    
    // Mantém apenas os últimos 100 registros
    if (existingData.length > 100) {
      existingData.splice(0, existingData.length - 100)
    }
    
    const saved = savePrivateData('moodcapture_emotions', existingData)
    return saved ? newData : null
  } catch (error) {
    console.error('Erro ao salvar dados de emoção:', error)
    return null
  }
}

// Recupera dados de emoção armazenados com privacidade
export const getEmotionHistory = (days = 7) => {
  try {
    const data = loadPrivateData('moodcapture_emotions') || []
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return data.filter(emotion => {
      const emotionDate = new Date(emotion.timestamp)
      return emotionDate >= cutoffDate
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  } catch (error) {
    console.error('Erro ao recuperar histórico de emoções:', error)
    return []
  }
}

// Gera insights baseados no histórico
export const generateInsights = (history) => {
  if (history.length === 0) {
    return [
      {
        type: 'info',
        title: 'Comece sua jornada',
        description: 'Capture suas primeiras emoções para receber insights personalizados'
      }
    ]
  }
  
  const insights = []
  const emotionCounts = {}
  
  // Conta as emoções
  history.forEach(emotion => {
    emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + 1
  })
  
  // Emoção mais frequente
  const mostFrequent = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0]
  
  if (mostFrequent) {
    insights.push({
      type: 'positive',
      title: `Você teve ${mostFrequent[1]} momentos de ${mostFrequent[0].toLowerCase()}`,
      description: 'Isso é ótimo para seu bem-estar!'
    })
  }
  
  // Tendência recente
  const recentEmotions = history.slice(0, 3)
  const positiveEmotions = ['Calmo', 'Feliz']
  const recentPositive = recentEmotions.filter(e => positiveEmotions.includes(e.name))
  
  if (recentPositive.length >= 2) {
    insights.push({
      type: 'positive',
      title: 'Suas emoções estão mais positivas recentemente',
      description: 'Continue com as práticas que estão funcionando!'
    })
  }
  
  return insights
}

