import { Camera, Shield, BarChart3, Heart, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HomePage = ({ onPageChange, lastEmotion }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pt-12">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Olá! 👋</h1>
          <p className="text-muted-foreground mt-1">Como você está se sentindo hoje?</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full">
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Main Emotion Capture */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-medium text-foreground">
            Como você está se sentindo hoje?
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Toque no botão abaixo para capturar suas emoções de forma segura e privada
          </p>
        </div>

        {/* Emotion Capture Button */}
        <div className="relative">
          <Button
            onClick={() => onPageChange('capture')}
            className="w-32 h-32 rounded-full bg-primary hover:bg-primary/90 shadow-lg gentle-shadow breathing-animation"
          >
            <Camera className="w-8 h-8 text-white" />
          </Button>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-white px-3 py-1 rounded-full shadow-sm border">
              <span className="text-xs text-muted-foreground">Toque para capturar</span>
            </div>
          </div>
        </div>

        {/* Current State */}
        <div className="w-full max-w-sm">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow emotion-card">
            <h3 className="text-lg font-medium text-center text-foreground mb-4">
              Estado emocional
            </h3>
            {lastEmotion ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: `${lastEmotion.color}20` }}>
                  <span className="text-2xl">{lastEmotion.emoji}</span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Última captura</p>
                  <p className="font-medium text-foreground">{lastEmotion.name}</p>
                  <p className="text-xs text-muted-foreground">{lastEmotion.time}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Primeira captura</p>
                  <p className="font-medium text-foreground">Comece sua jornada</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mt-8">
        <button 
          onClick={() => onPageChange('history')}
          className="bg-primary/10 p-4 rounded-xl text-center hover:bg-primary/20 transition-colors"
        >
          <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
          <span className="text-xs text-foreground font-medium">Histórico</span>
        </button>
        <button 
          onClick={() => onPageChange('resources')}
          className="bg-secondary/30 p-4 rounded-xl text-center hover:bg-secondary/40 transition-colors"
        >
          <Heart className="w-6 h-6 text-secondary-foreground mx-auto mb-2" />
          <span className="text-xs text-foreground font-medium">Recursos</span>
        </button>
        <button 
          onClick={() => onPageChange('settings')}
          className="bg-accent/30 p-4 rounded-xl text-center hover:bg-accent/40 transition-colors"
        >
          <Settings className="w-6 h-6 text-accent-foreground mx-auto mb-2" />
          <span className="text-xs text-foreground font-medium">Configurações</span>
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Processamento local</p>
            <p className="text-xs text-muted-foreground">Seus dados ficam seguros no seu dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

