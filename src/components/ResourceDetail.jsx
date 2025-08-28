import { useState } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ResourceDetail = ({ resource, type, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setTimer(0)
    setIsCompleted(false)
  }

  const handleComplete = () => {
    setIsCompleted(true)
    setIsPlaying(false)
  }

  const renderBreathingExercise = () => (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🫁</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{resource.title}</h2>
              <p className="text-sm text-muted-foreground">{resource.duration} • {resource.difficulty}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-primary">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{resource.duration}</span>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">{resource.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {resource.benefits.map((benefit, index) => (
            <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <h3 className="text-lg font-semibold text-foreground mb-4">Como praticar:</h3>
        <div className="space-y-3">
          {resource.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">{index + 1}</span>
              </div>
              <p className="text-sm text-foreground">{instruction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Dicas importantes:</h3>
        <div className="space-y-2">
          {resource.tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Button */}
      <div className="text-center">
        <Button
          onClick={handlePlayPause}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-lg"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pausar Prática
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Iniciar Prática
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderMeditation = () => (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">🧘</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{resource.title}</h2>
              <p className="text-sm text-muted-foreground">{resource.duration} • {resource.difficulty}</p>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">{resource.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {resource.benefits.map((benefit, index) => (
            <span key={index} className="px-3 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded-full">
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Meditation Script */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <h3 className="text-lg font-semibold text-foreground mb-4">Roteiro da meditação:</h3>
        <div className="space-y-4">
          {resource.script.map((step, index) => (
            <div key={index} className={`p-4 rounded-lg transition-colors ${
              currentStep === index && isPlaying 
                ? 'bg-secondary/20 border border-secondary/30' 
                : 'bg-muted/30'
            }`}>
              <p className="text-sm text-foreground leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Affirmations */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-secondary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Afirmações positivas:</h3>
        <div className="space-y-2">
          {resource.affirmations.map((affirmation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Heart className="w-4 h-4 text-secondary-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground italic">"{affirmation}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Controls */}
      <div className="text-center space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handlePlayPause}
            className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Iniciar
              </>
            )}
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-6 py-3 rounded-full"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reiniciar
          </Button>
        </div>
        
        {isCompleted && (
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-primary font-medium">🎉 Meditação concluída! Como você se sente?</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderTip = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{resource.title}</h2>
            <p className="text-sm text-muted-foreground">{resource.category} • {resource.readTime}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-line">{resource.content}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {resource.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="text-center">
        <Button
          onClick={handleComplete}
          className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full"
        >
          <Heart className="w-5 h-5 mr-2" />
          Marcar como Lida
        </Button>
      </div>
    </div>
  )

  const renderInfo = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{resource.title}</h2>
            <p className="text-sm text-muted-foreground">{resource.category} • {resource.readTime}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
        <div className="prose prose-sm max-w-none">
          <div className="text-foreground leading-relaxed whitespace-pre-line">{resource.content}</div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {resource.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Resources */}
      {resource.resources && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recursos adicionais:</h3>
          <div className="space-y-2">
            {resource.resources.map((resourceItem, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{resourceItem}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Recurso de Bem-estar</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {type === 'breathing' && renderBreathingExercise()}
        {type === 'meditation' && renderMeditation()}
        {type === 'tips' && renderTip()}
        {type === 'info' && renderInfo()}
      </div>
    </div>
  )
}

export default ResourceDetail

