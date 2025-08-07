# Guia de Implementação e Deployment - MoodCapture ED

## Visão Geral

Este guia fornece instruções detalhadas para implementar, configurar e fazer o deployment do aplicativo MoodCapture ED em diferentes ambientes.

## Pré-requisitos

### Ambiente de Desenvolvimento

- **Node.js**: 18.0.0 ou superior
- **npm**: 8.0.0 ou superior (ou pnpm 7.0.0+)
- **Git**: Para controle de versão
- **Editor**: VS Code recomendado

### Navegadores Suportados

- **Chrome**: 80+ (recomendado)
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### Dispositivos

- **Mobile**: iOS 13+, Android 8+
- **Desktop**: Suporte limitado (câmera necessária)
- **Câmera**: Frontal obrigatória para funcionalidade principal

## Instalação Local

### 1. Clone do Repositório

```bash
# Clone o projeto
git clone <repository-url>
cd moodcapture-ed

# Instale dependências
npm install
# ou
pnpm install
```

### 2. Configuração do Ambiente

```bash
# Copie o arquivo de ambiente (se existir)
cp .env.example .env.local

# Configure variáveis necessárias
# VITE_APP_NAME=MoodCapture ED
# VITE_APP_VERSION=1.0.0
```

### 3. Execução em Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
# ou
pnpm dev

# Acesse: http://localhost:5173
```

### 4. Teste de Funcionalidades

- **Câmera**: Permita acesso quando solicitado
- **Offline**: Teste desconectando internet
- **Responsividade**: Use DevTools para simular mobile
- **PWA**: Instale como app no navegador

## Build para Produção

### 1. Build Otimizado

```bash
# Gere build de produção
npm run build
# ou
pnpm build

# Arquivos gerados em: dist/
```

### 2. Preview Local

```bash
# Teste o build localmente
npm run preview
# ou
pnpm preview

# Acesse: http://localhost:4173
```

### 3. Análise do Bundle

```bash
# Analise tamanho do bundle
npm run build -- --analyze
# ou use ferramenta externa
npx vite-bundle-analyzer dist
```

## Deployment

### Opção 1: Netlify (Recomendado)

```bash
# 1. Instale Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod --dir=dist

# 4. Configure domínio personalizado (opcional)
netlify domains:add yourdomain.com
```

**Configurações Netlify:**
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Opção 2: Vercel

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Configure domínio (opcional)
vercel domains add yourdomain.com
```

**Configurações Vercel:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

### Opção 3: GitHub Pages

```bash
# 1. Instale gh-pages
npm install --save-dev gh-pages

# 2. Adicione script no package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 3. Configure base no vite.config.js
export default defineConfig({
  base: '/moodcapture-ed/',
  // ... outras configurações
})

# 4. Build e deploy
npm run build
npm run deploy
```

### Opção 4: Servidor Próprio

```bash
# 1. Build do projeto
npm run build

# 2. Configure servidor web (nginx exemplo)
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/dist;
    index index.html;
    
    # PWA e SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
    }
    
    # Segurança
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
}

# 3. SSL obrigatório para câmera
certbot --nginx -d yourdomain.com
```

## Configurações de Produção

### 1. Variáveis de Ambiente

```bash
# .env.production
VITE_APP_NAME=MoodCapture ED
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_ENABLE_ANALYTICS=false
```

### 2. Service Worker

```javascript
// Registre o service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

### 3. Manifest PWA

```json
{
  "name": "MoodCapture ED",
  "short_name": "MoodCapture",
  "description": "Cuidado emocional com IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#7FB069",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Monitoramento e Manutenção

### 1. Logs e Debugging

```javascript
// Configuração de logs
const isDev = import.meta.env.DEV;

export const logger = {
  info: (message, data) => {
    if (isDev) console.log(`[INFO] ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Em produção, enviar para serviço de monitoramento
  },
  warn: (message, data) => {
    if (isDev) console.warn(`[WARN] ${message}`, data);
  }
};
```

### 2. Métricas de Performance

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Enviar métricas para serviço de análise
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. Atualizações

```javascript
// Verificação de atualizações
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // Notificar usuário sobre atualização
  if (confirm('Nova versão disponível. Recarregar?')) {
    window.location.reload();
  }
});
```

## Segurança

### 1. Headers de Segurança

```nginx
# Nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
```

### 2. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: blob:; 
               media-src 'self' blob:;">
```

### 3. HTTPS Obrigatório

```javascript
// Redirecionar para HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

## Otimizações

### 1. Performance

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 2. Compressão

```nginx
# Nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/javascript application/xml+rss 
           application/json;
```

### 3. Cache

```nginx
# Cache estático
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML sem cache
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## Troubleshooting

### Problemas Comuns

**1. Câmera não funciona**
- Verificar HTTPS
- Verificar permissões do navegador
- Testar em dispositivo diferente

**2. Service Worker não registra**
- Verificar console para erros
- Limpar cache do navegador
- Verificar caminho do arquivo

**3. PWA não instala**
- Verificar manifest.json
- Verificar service worker
- Testar em navegador suportado

**4. Dados não salvam**
- Verificar localStorage disponível
- Verificar cota de armazenamento
- Verificar modo privado/incógnito

### Logs de Debug

```javascript
// Ativar logs detalhados
localStorage.setItem('debug', 'true');

// Verificar armazenamento
console.log('Storage quota:', await navigator.storage.estimate());

// Verificar service worker
console.log('SW registration:', await navigator.serviceWorker.getRegistration());
```

## Checklist de Deploy

### Pré-Deploy
- [ ] Testes locais passando
- [ ] Build sem erros
- [ ] Service worker funcionando
- [ ] PWA instalável
- [ ] Responsividade testada
- [ ] Funcionalidade offline testada

### Deploy
- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS configurado
- [ ] Headers de segurança
- [ ] Compressão ativada
- [ ] Cache configurado
- [ ] Domínio personalizado (se aplicável)

### Pós-Deploy
- [ ] Funcionalidades testadas em produção
- [ ] PWA instalável
- [ ] Performance verificada
- [ ] Logs de erro monitorados
- [ ] Backup de dados configurado

## Suporte e Manutenção

### Atualizações Regulares

1. **Dependências**: Atualizar mensalmente
2. **Segurança**: Patches imediatos
3. **Features**: Releases planejados
4. **Cache**: Versionamento automático

### Monitoramento

1. **Uptime**: Verificação contínua
2. **Performance**: Métricas semanais
3. **Erros**: Alertas automáticos
4. **Uso**: Estatísticas mensais

### Backup

1. **Código**: Git com branches protegidas
2. **Configurações**: Documentação atualizada
3. **Dados**: Exportação regular (se aplicável)

---

Este guia fornece uma base sólida para implementar e manter o MoodCapture ED em produção. Adapte as configurações conforme suas necessidades específicas e ambiente de deployment.

