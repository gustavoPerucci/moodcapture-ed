import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Calendar, Download, BarChart3, PieChart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, Tooltip } from 'recharts'
import { getDataForPeriod, exportEmotionData } from '../lib/historyAnalysis'

const HistoryPage = ({ onPageChange, emotionHistory }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [data, setData] = useState(null)
  const [viewMode, setViewMode] = useState('trend') // 'trend', 'distribution', 'insights'

  useEffect(() => {
    const periodData = getDataForPeriod(selectedPeriod)
    setData(periodData)
  }, [selectedPeriod, emotionHistory])

  const handleExport = () => {
    const csvData = exportEmotionData(data?.days || 30)
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `moodcapture-historico-${selectedPeriod}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6 pb-24">
        <div className="flex items-center justify-center flex-1">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const periods = [
    { key: 'week', label: 'Semana', days: 7 },
    { key: 'month', label: 'Mês', days: 30 },
    { key: 'quarter', label: 'Trimestre', days: 90 }
  ]

  const viewModes = [
    { key: 'trend', label: 'Tendência', icon: TrendingUp },
    { key: 'distribution', label: 'Distribuição', icon: PieChart },
    { key: 'insights', label: 'Insights', icon: BarChart3 }
  ]

  const renderTrendView = () => (
    <div className="space-y-6">
      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 gentle-shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{data.stats.totalCaptures}</p>
            <p className="text-xs text-muted-foreground">Capturas</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 gentle-shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-foreground">{data.stats.streak}</p>
            <p className="text-xs text-muted-foreground">Dias seguidos</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Tendência Emocional</h3>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        
        {data.chartData.dailyData.length > 0 ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData.weeklyTrend}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#457B9D' }}
                />
                <YAxis 
                  domain={[1, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#457B9D' }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-muted-foreground">
                            Humor: {payload[0].value}/5
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Capturas: {data.count}
                          </p>
                          {data.dominant && (
                            <p className="text-sm text-primary">
                              Dominante: {data.dominant}
                            </p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="trend" 
                  stroke="#7FB069" 
                  strokeWidth={3}
                  dot={{ fill: '#7FB069', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#7FB069' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível para este período</p>
          </div>
        )}

        <div className="flex justify-between mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Tendência do humor</span>
          </div>
          {data.stats.improvement !== 0 && (
            <div className={`flex items-center space-x-1 ${
              data.stats.improvement > 0 ? 'text-green-600' : 'text-orange-600'
            }`}>
              <span className="text-xs">
                {data.stats.improvement > 0 ? '↗' : '↘'} 
                {Math.abs(data.stats.improvement).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderDistributionView = () => (
    <div className="space-y-6">
      {/* Distribuição de Emoções */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <h3 className="text-lg font-medium text-foreground mb-4">Distribuição de Emoções</h3>
        
        {data.chartData.emotionDistribution.length > 0 ? (
          <div className="space-y-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data.chartData.emotionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {data.chartData.emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value} capturas ({data.percentage}%)
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {data.chartData.emotionDistribution.map((emotion, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: emotion.color }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">{emotion.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{emotion.percentage}%</span>
                    <p className="text-xs text-muted-foreground">{emotion.value} vezes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível para este período</p>
          </div>
        )}
      </div>

      {/* Emoção Mais Frequente */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
        <div className="text-center">
          <h4 className="font-semibold text-foreground mb-2">Emoção Predominante</h4>
          <p className="text-lg font-bold text-primary">{data.stats.mostFrequent}</p>
          <p className="text-sm text-muted-foreground">
            Apareceu em {data.chartData.emotionDistribution[0]?.percentage || 0}% das capturas
          </p>
        </div>
      </div>
    </div>
  )

  const renderInsightsView = () => (
    <div className="space-y-4">
      {data.insights.map((insight, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 gentle-shadow emotion-card fade-in">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              insight.type === 'positive' ? 'bg-green-100 text-green-600' :
              insight.type === 'attention' ? 'bg-orange-100 text-orange-600' :
              insight.type === 'recommendation' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              <span className="text-lg">{insight.icon}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm mb-1">
                {insight.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {insight.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-8">
        <button 
          onClick={() => onPageChange('home')}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Histórico Emocional</h1>
        <button
          onClick={handleExport}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <Download className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2 mb-6">
        {periods.map((period) => (
          <button
            key={period.key}
            onClick={() => setSelectedPeriod(period.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedPeriod === period.key
                ? 'bg-primary text-white' 
                : 'bg-white/60 text-foreground hover:bg-white/80'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* View Mode Selector */}
      <div className="flex space-x-2 mb-6">
        {viewModes.map((mode) => {
          const Icon = mode.icon
          return (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === mode.key
                  ? 'bg-secondary/20 text-secondary-foreground' 
                  : 'bg-white/40 text-foreground hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{mode.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1">
        {viewMode === 'trend' && renderTrendView()}
        {viewMode === 'distribution' && renderDistributionView()}
        {viewMode === 'insights' && renderInsightsView()}
      </div>

      {/* Summary Card */}
      <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
        <div className="text-center">
          <h4 className="font-semibold text-foreground mb-2">
            Resumo {periods.find(p => p.key === selectedPeriod)?.label}
          </h4>
          <p className="text-sm text-muted-foreground">
            {data.stats.totalCaptures > 0 ? (
              <>
                Você fez {data.stats.totalCaptures} capturas com humor médio de {data.stats.averageMood}/5.
                {data.stats.improvement > 0 && ' Suas emoções estão melhorando!'}
                {data.stats.improvement < 0 && ' Considere praticar mais autocuidado.'}
              </>
            ) : (
              'Nenhuma captura registrada neste período. Comece a registrar suas emoções!'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage

