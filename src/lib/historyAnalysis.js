// Sistema de análise de histórico emocional

import { getEmotionHistory } from './emotionAnalysis'

// Mapear emoções para valores numéricos para análise
const emotionValues = {
  'Feliz': 5,
  'Calmo': 4,
  'Neutro': 3,
  'Pensativo': 2,
  'Preocupado': 1
}

// Mapear emoções para cores
const emotionColors = {
  'Feliz': '#F4A261',
  'Calmo': '#7FB069',
  'Neutro': '#A8DADC',
  'Pensativo': '#C8B6E2',
  'Preocupado': '#E9ECEF'
}

// Processar dados para gráficos
export const processEmotionDataForCharts = (days = 7) => {
  const history = getEmotionHistory(days)
  
  if (history.length === 0) {
    return {
      dailyData: [],
      emotionDistribution: [],
      weeklyTrend: [],
      insights: []
    }
  }

  // Agrupar por dia
  const dailyGroups = {}
  const today = new Date()
  
  // Inicializar últimos 7 dias
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    dailyGroups[dateKey] = []
  }

  // Agrupar emoções por dia
  history.forEach(emotion => {
    const emotionDate = new Date(emotion.timestamp).toISOString().split('T')[0]
    if (dailyGroups[emotionDate]) {
      dailyGroups[emotionDate].push(emotion)
    }
  })

  // Processar dados diários
  const dailyData = Object.entries(dailyGroups).map(([date, emotions]) => {
    const dayName = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' })
    
    if (emotions.length === 0) {
      return {
        day: dayName,
        date,
        average: 3, // Neutro
        count: 0,
        emotions: []
      }
    }

    const average = emotions.reduce((sum, emotion) => 
      sum + emotionValues[emotion.name], 0) / emotions.length

    const emotionCounts = {}
    emotions.forEach(emotion => {
      emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + 1
    })

    return {
      day: dayName,
      date,
      average: Math.round(average * 10) / 10,
      count: emotions.length,
      emotions: emotionCounts,
      dominant: Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutro'
    }
  })

  // Distribuição de emoções
  const emotionCounts = {}
  history.forEach(emotion => {
    emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + 1
  })

  const emotionDistribution = Object.entries(emotionCounts).map(([name, count]) => ({
    name,
    value: count,
    percentage: Math.round((count / history.length) * 100),
    color: emotionColors[name]
  })).sort((a, b) => b.value - a.value)

  // Tendência semanal (média móvel)
  const weeklyTrend = dailyData.map((day, index) => {
    const windowSize = Math.min(3, index + 1) // Janela de 3 dias
    const startIndex = Math.max(0, index - windowSize + 1)
    const window = dailyData.slice(startIndex, index + 1)
    
    const windowAverage = window.reduce((sum, d) => sum + d.average, 0) / window.length
    
    return {
      ...day,
      trend: Math.round(windowAverage * 10) / 10
    }
  })

  return {
    dailyData,
    emotionDistribution,
    weeklyTrend,
    totalCaptures: history.length
  }
}

// Gerar insights baseados nos dados
export const generateEmotionInsights = (days = 7) => {
  const { dailyData, emotionDistribution, totalCaptures } = processEmotionDataForCharts(days)
  const insights = []

  if (totalCaptures === 0) {
    return [{
      type: 'info',
      icon: '🌱',
      title: 'Comece sua jornada',
      description: 'Capture suas primeiras emoções para receber insights personalizados sobre seu bem-estar.',
      priority: 1
    }]
  }

  // Insight sobre emoção dominante
  if (emotionDistribution.length > 0) {
    const dominant = emotionDistribution[0]
    const isPositive = ['Feliz', 'Calmo'].includes(dominant.name)
    
    insights.push({
      type: isPositive ? 'positive' : 'neutral',
      icon: isPositive ? '✨' : '🤔',
      title: `${dominant.percentage}% das suas emoções foram de ${dominant.name.toLowerCase()}`,
      description: isPositive 
        ? 'Isso é ótimo! Continue mantendo essas práticas positivas.'
        : 'É normal ter variações emocionais. Considere praticar exercícios de bem-estar.',
      priority: 1
    })
  }

  // Insight sobre frequência de capturas
  if (totalCaptures >= 5) {
    insights.push({
      type: 'positive',
      icon: '📊',
      title: `Você fez ${totalCaptures} capturas nos últimos ${days} dias`,
      description: 'Manter um registro regular das emoções ajuda no autoconhecimento.',
      priority: 2
    })
  }

  // Insight sobre tendência
  const recentDays = dailyData.slice(-3).filter(d => d.count > 0)
  if (recentDays.length >= 2) {
    const trend = recentDays[recentDays.length - 1].average - recentDays[0].average
    
    if (trend > 0.5) {
      insights.push({
        type: 'positive',
        icon: '📈',
        title: 'Suas emoções estão melhorando',
        description: 'Você demonstrou uma tendência positiva nos últimos dias!',
        priority: 1
      })
    } else if (trend < -0.5) {
      insights.push({
        type: 'attention',
        icon: '💙',
        title: 'Cuide do seu bem-estar',
        description: 'Considere praticar exercícios de respiração ou meditação.',
        priority: 1
      })
    }
  }

  // Insight sobre variedade emocional
  if (emotionDistribution.length >= 3) {
    insights.push({
      type: 'neutral',
      icon: '🌈',
      title: 'Você experimentou uma variedade de emoções',
      description: 'Ter diferentes emoções é natural e saudável. Continue se observando.',
      priority: 3
    })
  }

  // Insight sobre consistência
  const daysWithCaptures = dailyData.filter(d => d.count > 0).length
  if (daysWithCaptures >= days * 0.7) {
    insights.push({
      type: 'positive',
      icon: '🎯',
      title: 'Você tem sido consistente',
      description: 'Manter um registro regular é um excelente hábito de autocuidado.',
      priority: 2
    })
  }

  // Recomendações baseadas no padrão
  const negativeEmotions = emotionDistribution.filter(e => 
    ['Preocupado', 'Pensativo'].includes(e.name)
  )
  const negativePercentage = negativeEmotions.reduce((sum, e) => sum + e.percentage, 0)

  if (negativePercentage > 40) {
    insights.push({
      type: 'recommendation',
      icon: '🧘',
      title: 'Que tal experimentar meditação?',
      description: 'Baseado no seu padrão, exercícios de mindfulness podem ajudar.',
      priority: 1
    })
  }

  return insights.sort((a, b) => a.priority - b.priority)
}

// Obter estatísticas resumidas
export const getEmotionStats = (days = 7) => {
  const { dailyData, emotionDistribution, totalCaptures } = processEmotionDataForCharts(days)
  
  if (totalCaptures === 0) {
    return {
      totalCaptures: 0,
      averageMood: 3,
      mostFrequent: 'Neutro',
      streak: 0,
      improvement: 0
    }
  }

  // Média geral do humor
  const averageMood = dailyData.reduce((sum, day) => 
    sum + (day.average * day.count), 0) / totalCaptures

  // Emoção mais frequente
  const mostFrequent = emotionDistribution[0]?.name || 'Neutro'

  // Sequência de dias com capturas
  let streak = 0
  for (let i = dailyData.length - 1; i >= 0; i--) {
    if (dailyData[i].count > 0) {
      streak++
    } else {
      break
    }
  }

  // Melhoria (comparar primeira e segunda metade do período)
  const midPoint = Math.floor(dailyData.length / 2)
  const firstHalf = dailyData.slice(0, midPoint).filter(d => d.count > 0)
  const secondHalf = dailyData.slice(midPoint).filter(d => d.count > 0)
  
  let improvement = 0
  if (firstHalf.length > 0 && secondHalf.length > 0) {
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.average, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.average, 0) / secondHalf.length
    improvement = secondAvg - firstAvg
  }

  return {
    totalCaptures,
    averageMood: Math.round(averageMood * 10) / 10,
    mostFrequent,
    streak,
    improvement: Math.round(improvement * 10) / 10
  }
}

// Exportar dados para CSV
export const exportEmotionData = (days = 30) => {
  const history = getEmotionHistory(days)
  
  if (history.length === 0) {
    return null
  }

  const headers = ['Data', 'Hora', 'Emoção', 'Descrição', 'Confiança']
  const rows = history.map(emotion => [
    new Date(emotion.timestamp).toLocaleDateString('pt-BR'),
    emotion.time,
    emotion.name,
    emotion.description,
    `${Math.round(emotion.confidence * 100)}%`
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

// Obter dados para período específico
export const getDataForPeriod = (period) => {
  const days = {
    'week': 7,
    'month': 30,
    'quarter': 90
  }[period] || 7

  return {
    chartData: processEmotionDataForCharts(days),
    insights: generateEmotionInsights(days),
    stats: getEmotionStats(days),
    period: period,
    days: days
  }
}

