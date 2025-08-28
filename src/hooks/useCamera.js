import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    // É uma boa prática verificar se o elemento de vídeo já está disponível
    if (!videoRef.current) {
      console.warn("Tentativa de iniciar a câmera antes do elemento de vídeo estar pronto.");
      return;
    }

    try {
      setError(null);
      // Solicitar acesso à câmera frontal
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      // Ponto crucial: Conecta o stream ao elemento de vídeo assim que ele é obtido.
      videoRef.current.srcObject = stream;

      streamRef.current = stream;
      setIsActive(true);
      setHasPermission(true);
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setError(err.message);
      setHasPermission(false);
    }
  }, []); // useCallback com array vazio é correto aqui, pois refs não precisam ser dependências.

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isActive) return null;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Inverte a imagem horizontalmente para corresponder à visualização (efeito espelho)
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(videoRef.current, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isActive]);

  return {
    videoRef,
    isActive,
    error,
    hasPermission,
    startCamera,
    stopCamera,
    captureFrame
  };
};