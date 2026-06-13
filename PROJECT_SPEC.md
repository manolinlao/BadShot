# BadShot - Especificación del Proyecto

## Concepto
Red social tipo Instagram enfocada en espressos de café de especialidad.

**Estrategia de Plataforma**: PWA (Progressive Web App) optimizada para móvil, tablet y desktop. Apps nativas (iOS/Android) se desarrollarán post-MVP si hay demanda.

## MVP (Producto Mínimo Viable)

### Features Core del MVP
1. **Autenticación**
   - Registro/Login con email y contraseña
   - Perfil básico (nombre, username, bio, foto)

2. **Publicación de Shots**
   - Subir foto de espresso
   - Información básica:
     - Café usado (origen, tostador)
     - Método de extracción
     - Receta básica (dosis, tiempo, ratio)
     - Descripción/notas de cata
   - Calificación (1-5 estrellas)

3. **Feed Social**
   - Feed cronológico de shots
   - Like/unlike
   - Comentarios básicos
   - Ver perfil de otros usuarios

4. **Perfil de Usuario**
   - Ver shots propios
   - Estadísticas básicas (total shots, cafés probados)
   - Seguir/dejar de seguir usuarios

5. **Exploración**
   - Buscar usuarios
   - Buscar por origen de café o tostador
   - Filtrar shots por calificación

## Arquitectura Técnica

### Stack Tecnológico

#### Frontend (PWA)
- **Framework**: React 18+ con TypeScript
- **Build Tool**: Vite
- **PWA**: 
  - Vite PWA Plugin (workbox)
  - Service Worker para offline capability
  - Web App Manifest
- **Routing**: React Router v6
- **State Management**: 
  - **Effector** (state management con event-driven architecture)
  - **Effector-react** (React bindings)
  - TanStack Query (server state, caching, optimistic updates)
- **Local Storage/Offline**: 
  - **IndexedDB** (via Dexie.js) para:
    - Cache de shots y perfiles
    - Queue de acciones offline (likes, comentarios, posts)
    - Sincronización automática cuando vuelve conexión
- **UI/Styling**: 
  - **Tailwind CSS** (utility-first, responsive)
  - HeadlessUI o Radix UI (componentes accesibles)
  - React Hook Form para formularios
  - Zod para validación
- **Imágenes**: 
  - React Dropzone
  - Cliente de Cloudinary o AWS S3
  - Compresión en cliente (browser-image-compression)

#### Backend
- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js o Fastify
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT + bcrypt
- **Validación**: Zod
- **Storage**: 
  - Cloudinary para imágenes (recomendado para MVP)
  - o AWS S3 + CloudFront
- **API Style**: RESTful (o tRPC para type-safety end-to-end)

### Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────┐
│         Frontend (React + TS)           │
│  ┌─────────────┐  ┌─────────────┐     │
│  │   Web App   │  │ Mobile PWA  │     │
│  └─────────────┘  └─────────────┘     │
└─────────────┬───────────────────────────┘
              │ REST API / tRPC
              │
┌─────────────▼───────────────────────────┐
│       Backend (Node + Express)          │
│  ┌──────┐  ┌──────┐  ┌──────────┐     │
│  │ Auth │  │ API  │  │ Services │     │
│  └──────┘  └──────┘  └──────────┘     │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───▼──────┐      ┌──────▼─────┐
│PostgreSQL│      │ Cloudinary │
│          │      │   (CDN)    │
└──────────┘      └────────────┘
```

## Modelo de Datos (Entidades Principales)

### User
```typescript
{
  id: string (uuid)
  email: string (unique)
  username: string (unique)
  displayName: string
  bio: string?
  profileImage: string? (URL)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Shot
```typescript
{
  id: string (uuid)
  userId: string (FK)
  imageUrl: string
  coffeeBean: {
    origin: string
    roaster: string
    roastLevel?: string
  }
  recipe: {
    doseIn: number (gramos)
    doseOut: number (gramos)
    time: number (segundos)
    temperature?: number
    pressure?: number
  }
  extractionMethod: string (espresso, moka, aeropress, etc)
  tastingNotes: string
  rating: number (1-5)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Follow
```typescript
{
  id: string (uuid)
  followerId: string (FK User)
  followingId: string (FK User)
  createdAt: DateTime
}
```

### Like
```typescript
{
  id: string (uuid)
  userId: string (FK)
  shotId: string (FK)
  createdAt: DateTime
}
```

### Comment
```typescript
{
  id: string (uuid)
  userId: string (FK)
  shotId: string (FK)
  content: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Features Post-MVP (Roadmap)

### Fase 2
- Notificaciones push (Web Push API)
- Guardados/Bookmarks
- Hashtags para categorizar
- Feed personalizado (algoritmo basado en gustos)
- Instalación como app (Add to Home Screen optimizado)

### Fase 3
- Mensajería directa
- Historias/Stories (shots temporales)
- Recomendaciones de cafés/tostadores
- Integración con tiendas de café

### Fase 4
- Checkins en cafeterías (Geolocation API)
- Reviews de cafeterías
- Mapa de cafeterías visitadas
- Competiciones/Challenges
- Sistema de badges/logros
- **Apps nativas** (iOS/Android) si hay demanda

## Consideraciones de Seguridad

1. **Autenticación**
   - Passwords hasheados con bcrypt (salt rounds >= 10)
   - JWT con refresh tokens
   - Rate limiting en endpoints de auth

2. **Autorización**
   - Verificar ownership antes de editar/borrar
   - Middleware de autenticación en rutas protegidas

3. **Validación**
   - Validar en cliente Y servidor
   - Sanitizar inputs para prevenir XSS
   - Validar tipos de archivo de imágenes
   - Límites de tamaño de imagen

4. **API**
   - CORS configurado correctamente
   - Rate limiting general
   - Helmet.js para headers de seguridad

## Consideraciones de Performance

1. **Frontend/PWA**
   - Lazy loading de componentes y rutas
   - Infinite scroll en feeds
   - Optimización de imágenes (webp, tamaños responsivos)
   - Caché de TanStack Query
   - **Service Worker caching strategy**:
     - Cache-first para assets estáticos
     - Network-first para API calls con fallback a IndexedDB
   - **Lighthouse score objetivo**: 90+ en todas las métricas
   - **Responsive breakpoints**: Mobile (< 640px), Tablet (640-1024px), Desktop (> 1024px)

2. **Backend**
   - Índices en BD (userId, shotId, etc.)
   - Paginación en todas las listas
   - Caché con Redis (post-MVP)
   - CDN para imágenes

3. **Base de Datos**
   - Índices compuestos para queries comunes
   - Connection pooling
   - Query optimization
