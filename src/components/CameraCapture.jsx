import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { analyzeEmotion, saveEmotionData } from "@/lib/emotionAnalysis";

const CameraCapture = ({ onPageChange, onEmotionCaptured }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const {
    videoRef,
    isActive,
    error,
    hasPermission,
    startCamera,
    stopCamera,
    captureFrame,
  } = useCamera();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Log para depuração
  useEffect(() => {
    console.log({ isActive, hasPermission, error });
  }, [isActive, hasPermission, error]);

  // Função para salvar o histórico no localStorage
  const saveEmotionToHistory = (emotion) => {
    const history = JSON.parse(localStorage.getItem("emotionHistory") || "[]");
    history.unshift({
      ...emotion,
      time: new Date().toISOString(),
    });
    localStorage.setItem("emotionHistory", JSON.stringify(history));
  };

  const handleCapture = async () => {
    if (!isActive) return;
    setIsAnalyzing(true);
    try {
      const imageData = captureFrame();
      if (!imageData) throw new Error("Não foi possível capturar a imagem");
      const result = await analyzeEmotion(imageData);
      const savedData = saveEmotionData(result);
      // Salva o resultado no histórico local
      saveEmotionToHistory({
        ...result,
        emoji: result.emoji || "🙂",
        name: result.name || "Emoção",
        description: result.description || "",
        confidence: result.confidence || 1,
      });
      setAnalysisResult(result);
      setShowResult(true);
      if (onEmotionCaptured) onEmotionCaptured(savedData);
      stopCamera();
    } catch (err) {
      console.error("Erro na análise:", err);
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    stopCamera();
    onPageChange("home");
  };

  // Tela de resultado da análise
  if (showResult && analysisResult) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 p-6">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 fade-in">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${analysisResult.color}20` }}
          >
            <CheckCircle
              className="w-12 h-12"
              style={{ color: analysisResult.color }}
            />
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Captura realizada!
            </h2>
            <p className="text-muted-foreground max-w-xs">
              Detectamos que você está se sentindo{" "}
              {analysisResult.name.toLowerCase()}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow emotion-card max-w-sm w-full">
            <h3 className="text-lg font-medium text-center text-foreground mb-4">
              Seu estado emocional
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${analysisResult.color}20` }}
              >
                <span className="text-3xl">{analysisResult.emoji}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">
                  {analysisResult.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {analysisResult.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Confiança: {Math.round(analysisResult.confidence * 100)}%
                </p>
              </div>
            </div>
            {analysisResult.insights && analysisResult.insights.length > 0 && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-foreground">
                  {analysisResult.insights[0]}
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              setShowResult(false);
              setAnalysisResult(null);
              onPageChange("home");
            }}
            className="mt-6 bg-primary hover:bg-primary/90 text-white"
          >
            Avançar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-8">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">
          Captura de Emoções
        </h1>
        <div className="w-10" />
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-foreground mb-2">
          {hasPermission === false
            ? "Permissão necessária"
            : "Posicione seu rosto no círculo"}
        </h2>
        <p className="text-muted-foreground text-sm">
          {hasPermission === false
            ? "Precisamos acessar sua câmera para analisar suas emoções"
            : "Mantenha uma expressão natural e relaxada"}
        </p>
      </div>

      {/* Camera Interface */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          {/* Error State */}
          {error && (
            <div className="w-64 h-64 rounded-full border-4 border-destructive/30 bg-destructive/10 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
                <p className="text-sm text-destructive font-medium">
                  Erro ao acessar câmera
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Verifique as permissões
                </p>
                <Button
                  onClick={startCamera}
                  className="mt-3 bg-destructive hover:bg-destructive/90 text-white text-xs px-3 py-1"
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {!error && hasPermission === null && (
            <div className="w-64 h-64 rounded-full border-4 border-primary/30 bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-foreground font-medium">
                  Carregando câmera...
                </p>
              </div>
            </div>
          )}

          {/* Camera Active */}
          {!error && (
            <div className="relative">
              <div className="w-64 h-64 rounded-full border-4 border-primary/30 overflow-hidden bg-black">
                {/* O <video> agora está sempre no DOM (quando não há erro).
        Usamos 'opacity' para controlar a visibilidade, garantindo que a ref esteja sempre pronta.
      */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>

              {/* Overlay de Análise */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-foreground font-medium">
                      Analisando...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Capture Button */}
          {isActive && !isAnalyzing && (
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={handleCapture}
                className="w-20 h-20 rounded-full bg-white hover:bg-primary/10 shadow-lg flex flex-col items-center justify-center"
              >
                <img
                  src="/capture-human.svg"
                  alt="Capturar emoção"
                  className="w-10 h-10 mb-1"
                />
                <span className="text-xs text-primary font-semibold">
                  Capturar emoção
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* Processing Status */}
        {isAnalyzing && (
          <div className="text-center space-y-2 fade-in">
            <p className="text-sm font-medium text-foreground">
              Analisando sua expressão...
            </p>
            <p className="text-xs text-muted-foreground">
              Processamento local em andamento
            </p>
          </div>
        )}

        {/* Permission Request */}
        {hasPermission === false && (
          <div className="text-center space-y-4">
            <Button
              onClick={startCamera}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Permitir acesso à câmera
            </Button>
            <p className="text-xs text-muted-foreground max-w-xs">
              Sua privacidade é importante. A análise é feita localmente no seu
              dispositivo.
            </p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Processamento local - seus dados ficam seguros
            </p>
            <p className="text-xs text-muted-foreground">
              Nenhuma imagem é enviada para servidores externos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
