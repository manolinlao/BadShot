# Próximos Pasos - BadShot

## ✅ Arquitectura Definida

- [x] Especificación completa del proyecto
- [x] Stack tecnológico decidido
- [x] Estructura de carpetas definida
- [x] Arquitectura Effector documentada
- [x] Setup PWA documentado

## 🚀 Plan de Implementación

### Fase 0: Setup Inicial (2-3 días)

#### 1. Inicializar Monorepo

```bash
# Crear estructura base
mkdir -p apps/web apps/api packages/shared

# Inicializar root package.json con workspaces
npm init -y
```

**Root package.json**:

```json
{
  "name": "badshot",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:web": "npm run dev -w apps/web",
    "dev:api": "npm run dev -w apps/api",
    "build": "npm run build -w apps/web && npm run build -w apps/api",
    "test": "npm run test --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

#### 2. Setup Frontend (apps/web)

```bash
cd apps/web
npm create vite@latest . -- --template react-ts

# Instalar dependencias core
npm install react-router-dom
npm install effector effector-react
npm install @tanstack/react-query
npm install axios
npm install dexie dexie-react-hooks
npm install react-hook-form zod @hookform/resolvers
npm install react-dropzone

# PWA
npm install -D vite-plugin-pwa workbox-window

# UI & Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @headlessui/react @heroicons/react
npm install clsx tailwind-merge

# Image compression
npm install browser-image-compression

# Dev tools
npm install -D @types/node
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configurar Tailwind** (`tailwind.config.js`):

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f9f5f0',
          100: '#f0e6d7',
          200: '#e0ccaf',
          300: '#d0b287',
          400: '#b8935f',
          500: '#6B4423', // Primary
          600: '#5a3a1e',
          700: '#4a2f19',
          800: '#392414',
          900: '#29190f',
        },
      },
    },
  },
  plugins: [],
};
```

**Configurar Vite PWA** (`vite.config.ts`) - Ver `PWA_SETUP.md`

#### 3. Setup Backend (apps/api)

```bash
cd apps/api
npm init -y

# Dependencias
npm install express cors helmet
npm install bcrypt jsonwebtoken
npm install dotenv
npm install zod
npm install @prisma/client
npm install cloudinary multer

# Dev dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/bcrypt @types/jsonwebtoken
npm install -D @types/cors @types/multer
npm install -D prisma
npm install -D nodemon ts-node
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Testing
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Inicializar Prisma**:

```bash
npx prisma init
```

**prisma/schema.prisma** (inicial):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  username     String    @unique
  displayName  String
  password     String
  bio          String?
  profileImage String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  shots        Shot[]
  comments     Comment[]
  likes        Like[]
  followers    Follow[]  @relation("Following")
  following    Follow[]  @relation("Followers")
}

model Shot {
  id               String   @id @default(uuid())
  imageUrl         String
  coffeeOrigin     String
  roaster          String
  roastLevel       String?
  doseIn           Float
  doseOut          Float
  time             Int
  temperature      Float?
  extractionMethod String
  tastingNotes     String
  rating           Int
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  comments         Comment[]
  likes            Like[]
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  shotId    String
  shot      Shot     @relation(fields: [shotId], references: [id], onDelete: Cascade)
}

model Like {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  shotId    String
  shot      Shot     @relation(fields: [shotId], references: [id], onDelete: Cascade)

  @@unique([userId, shotId])
}

model Follow {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())

  followerId  String
  follower    User     @relation("Followers", fields: [followerId], references: [id], onDelete: Cascade)

  followingId String
  following   User     @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
}
```

#### 4. Setup Database Local

```bash
# Opción 1: Docker (recomendado)
docker run --name badshot-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=badshot \
  -p 5432:5432 \
  -d postgres:16

# Opción 2: Instalar PostgreSQL localmente
# https://www.postgresql.org/download/
```

**.env** (apps/api):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/badshot"
JWT_SECRET="tu-secret-super-secreto-cambiar-en-prod"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Crear migración inicial**:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 5. Setup Shared Package (opcional)

```bash
cd packages/shared
npm init -y

npm install zod
npm install -D typescript
```

### Fase 1: Autenticación (3-4 días)

- [ ] Backend: Auth endpoints (register, login, me)
- [ ] Frontend: Auth forms (LoginForm, RegisterForm)
- [ ] Frontend: Effector auth model
- [ ] Frontend: ProtectedRoute component
- [ ] Frontend: Auth persistence (localStorage + IndexedDB)
- [ ] Testing: Auth flow E2E

### Fase 2: Perfil de Usuario (2-3 días)

- [ ] Backend: User endpoints (get, update, upload avatar)
- [ ] Frontend: Profile page
- [ ] Frontend: EditProfile modal
- [ ] Frontend: Avatar upload
- [ ] Frontend: Effector profile model

### Fase 3: Shots - CRUD (4-5 días)

- [ ] Backend: Shot endpoints (create, read, update, delete)
- [ ] Backend: Cloudinary integration
- [ ] Frontend: CreateShot page/form
- [ ] Frontend: ShotCard component
- [ ] Frontend: ShotDetail page
- [ ] Frontend: Image upload con compresión
- [ ] Frontend: Effector shots model
- [ ] Frontend: IndexedDB cache para shots

### Fase 4: Feed Social (3-4 días)

- [ ] Backend: Feed endpoint (paginado)
- [ ] Backend: Like/Unlike endpoint
- [ ] Frontend: Feed page con infinite scroll
- [ ] Frontend: Like button con optimistic update
- [ ] Frontend: Effector feed model
- [ ] Frontend: Offline support para likes

### Fase 5: Comentarios (2-3 días)

- [ ] Backend: Comment endpoints
- [ ] Frontend: CommentList, CommentForm
- [ ] Frontend: Effector comments model
- [ ] Frontend: Offline support para comentarios

### Fase 6: Seguir/Seguidores (2-3 días)

- [ ] Backend: Follow/Unfollow endpoints
- [ ] Backend: Followers/Following lists
- [ ] Frontend: Follow button
- [ ] Frontend: Followers/Following modal
- [ ] Frontend: Effector follow model

### Fase 7: Búsqueda y Exploración (3-4 días)

- [ ] Backend: Search endpoints (users, shots)
- [ ] Backend: Explore/trending endpoint
- [ ] Frontend: SearchBar component
- [ ] Frontend: Search page
- [ ] Frontend: Explore page
- [ ] Frontend: Filters

### Fase 8: PWA Optimizations (2-3 días)

- [ ] Service Worker caching strategies
- [ ] Offline sync queue
- [ ] Install prompt
- [ ] App icons y screenshots
- [ ] Performance audit (Lighthouse)
- [ ] Responsive testing (móvil, tablet, desktop)

### Fase 9: Testing & Bug Fixes (3-4 días)

- [ ] Unit tests (critical paths)
- [ ] Integration tests (API)
- [ ] E2E tests (user flows principales)
- [ ] Bug fixing
- [ ] Performance optimizations

### Fase 10: Deploy (1-2 días)

- [ ] Frontend: Vercel/Netlify
- [ ] Backend: Railway/Render/Fly.io
- [ ] Database: Supabase/Neon/Railway
- [ ] Cloudinary: Configuración producción
- [ ] Environment variables
- [ ] Domain setup
- [ ] SSL certificates

## ⏱️ Timeline Estimado

**MVP Completo**: ~6-8 semanas (1 developer full-time)

- Semana 1: Setup + Auth
- Semana 2-3: Shots CRUD + Upload
- Semana 4: Feed + Likes
- Semana 5: Comentarios + Follow
- Semana 6: Búsqueda + Exploración
- Semana 7: PWA optimizations
- Semana 8: Testing + Deploy

## 📦 Dependencias Totales

### Frontend

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "effector": "^23.0.0",
    "effector-react": "^23.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "dexie": "^3.2.0",
    "dexie-react-hooks": "^1.1.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-dropzone": "^14.2.0",
    "browser-image-compression": "^2.0.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.1.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.0",
    "workbox-window": "^7.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0"
  }
}
```

### Backend

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.0",
    "helmet": "^7.1.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.3.0",
    "zod": "^3.22.0",
    "@prisma/client": "^5.7.0",
    "cloudinary": "^1.41.0",
    "multer": "^1.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/multer": "^1.4.0",
    "typescript": "^5.3.0",
    "prisma": "^5.7.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^6.0.0"
  }
}
```

## 🎯 Siguiente Acción Inmediata

**¿Quieres que empiece a crear la estructura del monorepo y los archivos de configuración?**

Puedo generar:

1. Root `package.json` con workspaces
2. Frontend setup completo (Vite + React + Tailwind + Effector + PWA)
3. Backend setup completo (Express + Prisma + TypeScript)
4. Prisma schema completo
5. Archivos de configuración (tsconfig, eslint, etc.)
6. Estructura de carpetas completa
