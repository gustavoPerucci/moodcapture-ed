import { useState, useRef, useCallback } from 'react'

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      // Solicitar acesso à câmera frontal
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Câmera frontal
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsActive(true)
        setHasPermission(true)
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err)
      setError(err.message)
      setHasPermission(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsActive(false)
  }, [])

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isActive) return null

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    
    context.drawImage(videoRef.current, 0, 0)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [isActive])

  return {
    videoRef,
    isActive,
    error,
    hasPermission,
    startCamera,
    stopCamera,
    captureFrame
  }
}

