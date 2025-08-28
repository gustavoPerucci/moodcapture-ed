// Sistema de privacidade e proteção de dados para MoodCapture ED

const PRIVACY_CONFIG = {
  dataRetentionDays: 90,
  autoCleanup: true,
  encryptData: false, // Se quiser salvar SEM criptografia, troque para false!
  anonymizeData: true,
  shareAnalytics: false
}

const ENCRYPTION_KEY = 'moodcapture-ed-2024-privacy-key'

// Função para criptografar dados
function encryptData(data) {
  if (!PRIVACY_CONFIG.encryptData) {
    return JSON.stringify(data)
  }
  try {
    const jsonString = JSON.stringify(data)
    const encrypted = btoa(jsonString)
    return encrypted
  } catch (error) {
    console.error('Erro ao criptografar dados:', error)
    return JSON.stringify(data)
  }
}

// Função para descriptografar dados
function decryptData(encryptedData) {
  if (!PRIVACY_CONFIG.encryptData) {
    // Se não for criptografado, apenas faz parse do JSON
    try {
      return JSON.parse(encryptedData)
    } catch {
      return encryptedData
    }
  }
  if (typeof encryptedData !== 'string' || encryptedData.length === 0) {
    return encryptedData
  }
  try {
    const decrypted = atob(encryptedData)
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Erro ao descriptografar dados (provavelmente dados corrompidos):', error)
    return null
  }
}

// Função para anonimizar dados
function anonymizeEmotionData(emotionData) {
  if (!PRIVACY_CONFIG.anonymizeData) {
    return emotionData
  }
  return emotionData.map(emotion => ({
    name: emotion.name,
    confidence: Math.round(emotion.confidence * 10) / 10,
    timestamp: Math.floor(emotion.timestamp / (1000 * 60 * 60)) * (1000 * 60 * 60),
  }))
}

// Função para salvar dados com privacidade
export function savePrivateData(key, data) {
  try {
    const timestamp = Date.now()
    const dataWithTimestamp = {
      data: data,
      timestamp: timestamp,
      version: '1.0'
    }
    const encryptedData = encryptData(dataWithTimestamp)
    localStorage.setItem(key, encryptedData)
    console.log(`[Privacy] Dados salvos: ${key} (${new Date(timestamp).toISOString()})`)
    return true
  } catch (error) {
    console.error('Erro ao salvar dados privados:', error)
    return false
  }
}

// Função para carregar dados com privacidade
export function loadPrivateData(key) {
  try {
    const encryptedData = localStorage.getItem(key)
    if (!encryptedData) {
      return null
    }
    const decryptedData = decryptData(encryptedData)
    if (decryptedData && decryptedData.timestamp) {
      const dataAge = Date.now() - decryptedData.timestamp
      const maxAge = PRIVACY_CONFIG.dataRetentionDays * 24 * 60 * 60 * 1000
      if (dataAge > maxAge) {
        console.log(`[Privacy] Dados expirados removidos: ${key}`)
        localStorage.removeItem(key)
        return null
      }
    }
    return decryptedData ? decryptedData.data : decryptedData
  } catch (error) {
    console.error('Erro ao carregar dados privados:', error)
    return null
  }
}

// Função para limpar dados antigos
export function cleanupOldData() {
  if (!PRIVACY_CONFIG.autoCleanup) {
    return
  }
  try {
    const keys = Object.keys(localStorage)
    const now = Date.now()
    const maxAge = PRIVACY_CONFIG.dataRetentionDays * 24 * 60 * 60 * 1000
    let cleanedCount = 0
    keys.forEach(key => {
      if (key.startsWith('moodcapture-')) {
        try {
          const encryptedData = localStorage.getItem(key)
          if (encryptedData) {
            const decryptedData = decryptData(encryptedData)
            if (decryptedData && decryptedData.timestamp) {
              const dataAge = now - decryptedData.timestamp
              if (dataAge > maxAge) {
                localStorage.removeItem(key)
                cleanedCount++
              }
            }
          }
        } catch (error) {
          localStorage.removeItem(key)
          cleanedCount++
        }
      }
    })
    if (cleanedCount > 0) {
      console.log(`[Privacy] ${cleanedCount} itens de dados antigos removidos`)
    }
    return cleanedCount
  } catch (error) {
    console.error('Erro na limpeza de dados:', error)
    return 0
  }
}

// Função para obter configurações de privacidade
export function getPrivacySettings() {
  const savedSettings = loadPrivateData('moodcapture-privacy-settings')
  return { ...PRIVACY_CONFIG, ...savedSettings }
}

// Função para salvar configurações de privacidade
export function savePrivacySettings(settings) {
  const updatedSettings = { ...PRIVACY_CONFIG, ...settings }
  return savePrivateData('moodcapture-privacy-settings', updatedSettings)
}

// Função para exportar dados do usuário (LGPD/GDPR compliance)
export function exportUserData() {
  try {
    const userData = {}
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('moodcapture-')) {
        const data = loadPrivateData(key)
        if (data) {
          userData[key] = data
        }
      }
    })
    if (userData['moodcapture-emotions']) {
      userData['moodcapture-emotions'] = anonymizeEmotionData(userData['moodcapture-emotions'])
    }
    return {
      exportDate: new Date().toISOString(),
      dataRetentionDays: PRIVACY_CONFIG.dataRetentionDays,
      userData: userData
    }
  } catch (error) {
    console.error('Erro ao exportar dados do usuário:', error)
    return null
  }
}

// Função para deletar todos os dados do usuário
export function deleteAllUserData() {
  try {
    const keys = Object.keys(localStorage)
    let deletedCount = 0
    keys.forEach(key => {
      if (key.startsWith('moodcapture-')) {
        localStorage.removeItem(key)
        deletedCount++
      }
    })
    console.log(`[Privacy] ${deletedCount} itens de dados do usuário deletados`)
    return deletedCount
  } catch (error) {
    console.error('Erro ao deletar dados do usuário:', error)
    return 0
  }
}

// Função para obter estatísticas de uso de dados
export function getDataUsageStats() {
  try {
    const keys = Object.keys(localStorage)
    let totalSize = 0
    let itemCount = 0
    const oldestData = { date: Date.now(), key: null }
    const newestData = { date: 0, key: null }
    keys.forEach(key => {
      if (key.startsWith('moodcapture-')) {
        const data = localStorage.getItem(key)
        totalSize += data.length
        itemCount++
        try {
          const decryptedData = decryptData(data)
          if (decryptedData && decryptedData.timestamp) {
            if (decryptedData.timestamp < oldestData.date) {
              oldestData.date = decryptedData.timestamp
              oldestData.key = key
            }
            if (decryptedData.timestamp > newestData.date) {
              newestData.date = decryptedData.timestamp
              newestData.key = key
            }
          }
        } catch (error) {
          // Ignora dados corrompidos
        }
      }
    })
    return {
      totalSize: totalSize,
      itemCount: itemCount,
      oldestData: oldestData.key ? new Date(oldestData.date) : null,
      newestData: newestData.key ? new Date(newestData.date) : null,
      retentionDays: PRIVACY_CONFIG.dataRetentionDays
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas de dados:', error)
    return null
  }
}

// Inicializar limpeza automática
if (PRIVACY_CONFIG.autoCleanup) {
  setTimeout(cleanupOldData, 1000)
  setInterval(cleanupOldData, 24 * 60 * 60 * 1000)
}

// Registrar service worker se disponível
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[Privacy] Service Worker registrado:', registration.scope)
      })
      .catch((error) => {
        console.log('[Privacy] Falha ao registrar Service Worker:', error)
      })
  })
}

export default {
  savePrivateData,
  loadPrivateData,
  cleanupOldData,
  getPrivacySettings,
  savePrivacySettings,
  exportUserData,
  deleteAllUserData,
  getDataUsageStats
}