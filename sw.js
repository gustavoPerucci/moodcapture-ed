// Service Worker para MoodCapture ED
// Garante funcionalidade offline completa

const CACHE_NAME = 'moodcapture-ed-v1.0.0'
const STATIC_CACHE = 'moodcapture-static-v1'
const DYNAMIC_CACHE = 'moodcapture-dynamic-v1'

// Recursos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch((error) => {
        console.log('[SW] Error caching static assets:', error)
      })
  )
  
  // Força a ativação imediata
  self.skipWaiting()
})

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remove caches antigos
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Removing old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
  )
  
  // Assume controle imediato
  self.clients.claim()
})

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Ignora requisições não-HTTP
  if (!request.url.startsWith('http')) {
    return
  }
  
  // Estratégia Cache First para recursos estáticos
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              return caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, fetchResponse.clone())
                  return fetchResponse
                })
            })
        })
        .catch(() => {
          // Fallback para página offline
          if (request.destination === 'document') {
            return caches.match('/index.html')
          }
        })
    )
    return
  }
  
  // Estratégia Network First para APIs e dados dinâmicos
  if (url.pathname.includes('/api/') || url.pathname.includes('/data/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache apenas respostas válidas
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          // Fallback para cache
          return caches.match(request)
        })
    )
    return
  }
  
  // Estratégia Cache First para outros recursos
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response
        }
        
        return fetch(request)
          .then((fetchResponse) => {
            // Cache apenas respostas válidas
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone()
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
            }
            return fetchResponse
          })
      })
      .catch(() => {
        // Fallback para recursos essenciais
        if (request.destination === 'document') {
          return caches.match('/index.html')
        }
      })
  )
})

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'emotion-data-sync') {
    event.waitUntil(syncEmotionData())
  }
})

// Função para sincronizar dados de emoção
async function syncEmotionData() {
  try {
    // Aqui poderia implementar sincronização com servidor
    // Por enquanto, apenas log para demonstrar funcionalidade
    console.log('[SW] Syncing emotion data...')
    
    // Simula sincronização
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('[SW] Emotion data synced successfully')
  } catch (error) {
    console.error('[SW] Error syncing emotion data:', error)
  }
}

// Notificações push (para futuras implementações)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  const options = {
    body: 'Lembre-se de registrar suas emoções hoje!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'emotion-reminder',
    requireInteraction: false,
    actions: [
      {
        action: 'capture',
        title: 'Capturar Agora'
      },
      {
        action: 'later',
        title: 'Mais Tarde'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('MoodCapture ED', options)
  )
})

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'capture') {
    // Abre o app na tela de captura
    event.waitUntil(
      clients.openWindow('/?page=capture')
    )
  } else if (event.action === 'later') {
    // Agenda lembrete para mais tarde
    console.log('[SW] Reminder scheduled for later')
  } else {
    // Clique na notificação principal
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        )
      })
    )
  }
})

// Log de status
console.log('[SW] Service Worker loaded successfully')

