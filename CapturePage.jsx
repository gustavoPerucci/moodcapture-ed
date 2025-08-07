import { useState } from 'react'
import { ArrowLeft, Camera, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CapturePage = ({ onPageChange }) => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureComplete, setCaptureComplete] = useState(false)

  const handleCapture = () => {
    setIsCapturing(true)
    
    // Simular processamento de IA
    setTimeout(() => {
      setIsCapturing(false)
      setCaptureComplete(true)
      
      // Voltar para home após mostrar resultado
      setTimeout(() => {
        setCaptureComplete(false)
        onPageChange('home')
      }, 2000)
    }, 3000)
  }

  if (captureComplete) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 p-6">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 fade-in">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Captura realizada!
            </h2>
            <p className="text-muted-foreground max-w-xs">
              Detectamos que você está se sentindo calmo e tranquilo hoje
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow emotion-card max-w-sm w-full">
            <h3 className="text-lg font-medium text-center text-foreground mb-4">
              Seu estado emocional
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">😌</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">Calmo</p>
                <p className="text-sm text-muted-foreground">Nível de tranquilidade: Alto</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Redirecionando para a tela inicial...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-8">
        <button 
          onClick={() => onPageChange('home')}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Captura de Emoções</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-foreground mb-2">
          Posicione seu rosto no círculo
        </h2>
        <p className="text-muted-foreground text-sm">
          Mantenha uma expressão natural e relaxada
        </p>
      </div>

      {/* Camera Interface */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          {/* Camera Viewfinder */}
          <div className="w-64 h-64 rounded-full border-4 border-primary/30 bg-white/20 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
            {isCapturing ? (
              <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-foreground font-medium">Analisando...</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center mb-4">
                  <div className="w-20 h-24 border-2 border-primary/40 rounded-full relative">
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary/40 rounded-full"></div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-primary/40 rounded-full"></div>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-primary/40 rounded-full"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Posicione seu rosto aqui</p>
              </div>
            )}
          </div>

          {/* Capture Button */}
          {!isCapturing && (
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
              >
                <Camera className="w-6 h-6 text-white" />
              </Button>
            </div>
          )}
        </div>

        {/* Processing Status */}
        {isCapturing && (
          <div className="text-center space-y-2 fade-in">
            <p className="text-sm font-medium text-foreground">Processando sua expressão...</p>
            <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos</p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Processamento local - seus dados ficam seguros</p>
            <p className="text-xs text-muted-foreground">Nenhuma imagem é enviada para servidores externos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CapturePage

