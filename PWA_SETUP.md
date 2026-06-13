# PWA Setup - BadShot

## Progressive Web App Features

### Core PWA Features (MVP)
- ✅ Installable (Add to Home Screen)
- ✅ Offline-first con Service Worker
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Fast loading con caché estratégico
- ✅ Web App Manifest

### Post-MVP Features
- 📱 Push Notifications (Web Push API)
- 📸 Cámara directa (MediaStream API)
- 📍 Geolocation para check-ins
- 🔄 Background Sync
- 💾 Persistent Storage

## Configuración Vite PWA

### Instalación
```bash
npm install -D vite-plugin-pwa workbox-window
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Avisar al usuario cuando hay actualización
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      
      manifest: {
        name: 'BadShot - Espresso Social',
        short_name: 'BadShot',
        description: 'Red social de espressos de café de especialidad',
        theme_color: '#6B4423', // Color café
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        
        categories: ['food', 'social', 'lifestyle'],
        screenshots: [
          {
            src: 'screenshot-mobile-1.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow'
          },
          {
            src: 'screenshot-desktop-1.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      },
      
      workbox: {
        // Cache strategies
        runtimeCaching: [
          {
            // API calls - Network first, fallback to cache
            urlPattern: /^https:\/\/api\.badshot\.app\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Imágenes de Cloudinary - Cache first
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          {
            // Fonts - Cache first
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              }
            }
          }
        ],
        
        // Archivos a pre-cachear
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        
        // Navegación offline
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/]
      },
      
      devOptions: {
        enabled: true, // Habilitar PWA en desarrollo
        type: 'module'
      }
    })
  ]
})
```

## Web App Manifest

### manifest.json (generado por Vite PWA)
```json
{
  "name": "BadShot - Espresso Social",
  "short_name": "BadShot",
  "description": "Red social de espressos de café de especialidad",
  "theme_color": "#6B4423",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/",
  "start_url": "/",
  "icons": [...],
  "categories": ["food", "social", "lifestyle"],
  "shortcuts": [
    {
      "name": "Nuevo Shot",
      "short_name": "Nuevo",
      "description": "Crear nuevo shot de espresso",
      "url": "/create",
      "icons": [{ "src": "/icon-create.png", "sizes": "96x96" }]
    },
    {
      "name": "Mi Perfil",
      "short_name": "Perfil",
      "url": "/profile",
      "icons": [{ "src": "/icon-profile.png", "sizes": "96x96" }]
    }
  ]
}
```

## Service Worker Registration

### src/registerSW.ts
```typescript
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Mostrar UI para actualizar
    if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App lista para usar offline')
    // Opcional: mostrar toast informando
  },
  onRegistered(registration) {
    console.log('Service Worker registrado:', registration)
  },
  onRegisterError(error) {
    console.error('Error al registrar SW:', error)
  }
})
```

### src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './registerSW' // Registrar Service Worker

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

## IndexedDB Schema (Dexie)

### src/lib/indexeddb.ts
```typescript
import Dexie, { Table } from 'dexie'
import type { Shot, User, Comment, PendingAction } from '@/types'

export class BadShotDB extends Dexie {
  shots!: Table<Shot, string>
  users!: Table<User, string>
  comments!: Table<Comment, string>
  syncQueue!: Table<PendingAction, string>

  constructor() {
    super('BadShotDB')
    
    this.version(1).stores({
      shots: 'id, userId, createdAt',
      users: 'id, username',
      comments: 'id, shotId, userId',
      syncQueue: 'id, timestamp, type'
    })
  }
}

export const db = new BadShotDB()
```

### Uso en componentes
```typescript
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/indexeddb'

function OfflineShots() {
  // Live query - se actualiza automáticamente
  const cachedShots = useLiveQuery(
    () => db.shots.orderBy('createdAt').reverse().limit(20).toArray()
  )

  return (
    <div>
      {cachedShots?.map(shot => (
        <ShotCard key={shot.id} shot={shot} />
      ))}
    </div>
  )
}
```

## Estrategia de Sincronización

### Offline Actions Queue
```typescript
// models/sync/index.ts
import { createEffect, sample } from 'effector'
import { db } from '@/lib/indexeddb'
import { $isOnline, $syncQueue } from './stores'
import { addToSyncQueue, syncPendingActionsFx } from './events'

// Detectar cambios de conectividad
window.addEventListener('online', () => {
  setOnlineStatus(true)
  syncPendingActionsFx() // Auto-sync cuando vuelve conexión
})

window.addEventListener('offline', () => {
  setOnlineStatus(false)
})

// Wrapper para acciones que deben funcionar offline
export function withOfflineSupport<T>(
  fn: (payload: T) => Promise<any>,
  actionType: PendingAction['type']
) {
  return async (payload: T) => {
    try {
      // Intentar ejecutar normalmente
      return await fn(payload)
    } catch (error) {
      // Si falla (ej: offline), agregar a cola
      if (!navigator.onLine) {
        await addToSyncQueue({ type: actionType, payload })
        return { offline: true }
      }
      throw error
    }
  }
}

// Uso
const likeShot = withOfflineSupport(
  (shotId: string) => shotService.like(shotId),
  'like'
)
```

## Cache de Imágenes

### Caché optimista de imágenes antes de upload
```typescript
// services/upload.service.ts
export async function uploadImage(file: File) {
  // 1. Crear URL temporal (blob URL)
  const tempUrl = URL.createObjectURL(file)
  
  // 2. Comprimir imagen en cliente
  const compressed = await compressImage(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  })
  
  // 3. Subir a Cloudinary
  const formData = new FormData()
  formData.append('file', compressed)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET)
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: formData }
  )
  
  const data = await response.json()
  
  // 4. Limpiar blob URL
  URL.revokeObjectURL(tempUrl)
  
  return data.secure_url
}
```

## Install Prompt

### src/components/InstallPrompt.tsx
```typescript
import { useEffect, useState } from 'react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    console.log(`User ${outcome} the install prompt`)
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <p className="mb-3">¿Instalar BadShot en tu dispositivo?</p>
      <button onClick={handleInstall}>Instalar</button>
      <button onClick={() => setShowPrompt(false)}>Ahora no</button>
    </div>
  )
}
```

## Responsive Breakpoints (Tailwind)

### tailwind.config.js
```javascript
export default {
  theme: {
    screens: {
      'xs': '375px',    // Móviles pequeños
      'sm': '640px',    // Móviles grandes
      'md': '768px',    // Tablets
      'lg': '1024px',   // Desktop
      'xl': '1280px',   // Desktop grande
      '2xl': '1536px',  // Ultra wide
    }
  }
}
```

## Performance Targets

### Lighthouse Goals
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+
- **PWA**: Installable

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Técnicas de Optimización
1. **Code Splitting**: Lazy load de rutas y componentes grandes
2. **Image Optimization**: WebP, srcset, lazy loading
3. **Font Optimization**: Preload, font-display: swap
4. **Bundle Optimization**: Tree shaking, minificación
5. **Network**: HTTP/2, compression (gzip/brotli)
6. **Caching**: Service Worker + CDN
