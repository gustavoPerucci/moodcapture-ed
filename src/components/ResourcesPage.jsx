import { useState } from 'react'
import { ArrowLeft, Wind, Heart, BookOpen, Brain, Download, Phone } from 'lucide-react'
import ResourceDetail from './ResourceDetail'
import { 
  breathingExercises, 
  guidedMeditations, 
  wellnessTips, 
  mentalHealthInfo,
  emergencyResources,
  getEmotionBasedRecommendations,
  getContentById
} from '../data/wellnessContent'

const ResourcesPage = ({ onPageChange, lastEmotion }) => {
  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  // Obter recomendações baseadas na última emoção
  const recommendations = lastEmotion 
    ? getEmotionBasedRecommendations(lastEmotion.name)
    : getEmotionBasedRecommendations('Neutro')

  const handleResourceClick = (resourceId, type) => {
    const resource = getContentById(type, resourceId)
    if (resource) {
      setSelectedResource(resource)
      setSelectedType(type)
    }
  }

  const handleBack = () => {
    if (selectedResource) {
      setSelectedResource(null)
      setSelectedType(null)
    } else {
      onPageChange('home')
    }
  }

  // Se um recurso está selecionado, mostrar os detalhes
  if (selectedResource) {
    return (
      <ResourceDetail 
        resource={selectedResource}
        type={selectedType}
        onBack={handleBack}
      />
    )
  }

  const resourceCategories = [
    {
      id: 'breathing',
      title: 'Exercícios de Respiração',
      description: 'Técnicas simples para acalmar a mente',
      icon: Wind,
      color: 'bg-secondary/30 text-secondary-foreground',
      items: breathingExercises
    },
    {
      id: 'meditation',
      title: 'Meditações Guiadas',
      description: 'Práticas de mindfulness e relaxamento',
      icon: Heart,
      color: 'bg-primary/20 text-primary',
      items: guidedMeditations
    },
    {
      id: 'tips',
      title: 'Dicas de Bem-estar',
      description: 'Conselhos práticos para o dia a dia',
      icon: BookOpen,
      color: 'bg-accent/30 text-accent-foreground',
      items: wellnessTips
    },
    {
      id: 'info',
      title: 'Informações sobre Saúde Mental',
      description: 'Conteúdo educativo e de apoio',
      icon: Brain,
      color: 'bg-primary/20 text-primary',
      items: mentalHealthInfo
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-8">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Recursos de Acolhimento</h1>
        <div className="w-10" />
      </div>

      {/* Introduction */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow emotion-card mb-6">
        <h2 className="text-xl font-medium text-foreground mb-3">
          Cuidando do seu bem-estar
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Aqui você encontra recursos cuidadosamente selecionados para apoiar sua jornada de 
          autocuidado e bem-estar emocional. Todos os conteúdos estão disponíveis offline.
        </p>
        
        {lastEmotion && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-medium">Baseado no seu estado atual ({lastEmotion.name}):</span> 
              {' '}Recomendamos começar com exercícios de respiração ou meditação.
            </p>
          </div>
        )}
      </div>

      {/* Resource Categories */}
      <div className="space-y-6">
        {resourceCategories.map((category, categoryIndex) => {
          const Icon = category.icon
          const recommendedItems = recommendations[category.id] || []
          
          return (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {category.items.slice(0, 3).map((item, itemIndex) => {
                  const isRecommended = recommendedItems.includes(item.id)
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleResourceClick(item.id, category.id)}
                      className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 gentle-shadow emotion-card hover:scale-[1.02] transition-all duration-200 text-left fade-in ${
                        isRecommended ? 'ring-2 ring-primary/30' : ''
                      }`}
                      style={{ animationDelay: `${(categoryIndex * 3 + itemIndex) * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                            {isRecommended && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description || item.content?.substring(0, 100) + '...'}
                          </p>
                          {item.duration && (
                            <p className="text-xs text-primary mt-2 font-medium">{item.duration}</p>
                          )}
                          {item.readTime && (
                            <p className="text-xs text-primary mt-2 font-medium">{item.readTime}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Access Section */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Acesso Rápido</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleResourceClick('breathing-4-7-8', 'breathing')}
            className="bg-primary/10 p-4 rounded-xl text-center hover:bg-primary/20 transition-colors"
          >
            <Wind className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm text-foreground font-medium">Respiração 4-7-8</span>
            <p className="text-xs text-muted-foreground mt-1">Técnica rápida</p>
          </button>
          
          <button 
            onClick={() => handleResourceClick('meditation-calm', 'meditation')}
            className="bg-secondary/20 p-4 rounded-xl text-center hover:bg-secondary/30 transition-colors"
          >
            <Heart className="w-8 h-8 text-secondary-foreground mx-auto mb-2" />
            <span className="text-sm text-foreground font-medium">Meditação Calma</span>
            <p className="text-xs text-muted-foreground mt-1">10 min de paz</p>
          </button>
        </div>
      </div>

      {/* Offline Notice */}
      <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
        <div className="flex items-center space-x-3">
          <Download className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Conteúdo offline disponível</p>
            <p className="text-xs text-muted-foreground">
              Todos os recursos podem ser acessados sem conexão com a internet
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Support */}
      <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-destructive/20">
        <div className="text-center">
          <h4 className="font-semibold text-foreground mb-2">Precisa de ajuda profissional?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Se você está passando por um momento difícil, lembre-se de que buscar ajuda é um ato de coragem.
          </p>
          <div className="space-y-2">
            {emergencyResources.slice(0, 2).map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">{resource.name}</span>
                </div>
                <span className="text-sm font-bold text-destructive">{resource.phone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourcesPage

