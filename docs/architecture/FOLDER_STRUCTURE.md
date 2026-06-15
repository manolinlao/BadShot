# Estructura de Carpetas - BadShot

## Estructura Monorepo (Recomendada)

```
badshot/
├── apps/
│   ├── web/                          # Frontend React
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── manifest.json
│   │   ├── src/
│   │   │   ├── assets/               # Imágenes, fonts estáticos
│   │   │   │   ├── icons/
│   │   │   │   └── images/
│   │   │   ├── components/           # Componentes React
│   │   │   │   ├── ui/              # Componentes UI reutilizables
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Avatar.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── auth/            # Componentes de autenticación
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   └── ProtectedRoute.tsx
│   │   │   │   ├── shot/            # Componentes de shots
│   │   │   │   │   ├── ShotCard.tsx
│   │   │   │   │   ├── ShotDetail.tsx
│   │   │   │   │   ├── ShotForm.tsx
│   │   │   │   │   ├── RecipeInfo.tsx
│   │   │   │   │   └── ImageUpload.tsx
│   │   │   │   ├── feed/            # Componentes del feed
│   │   │   │   │   ├── FeedList.tsx
│   │   │   │   │   ├── FeedItem.tsx
│   │   │   │   │   └── InfiniteScroll.tsx
│   │   │   │   ├── profile/         # Componentes de perfil
│   │   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   │   ├── ProfileStats.tsx
│   │   │   │   │   ├── ProfileGrid.tsx
│   │   │   │   │   └── EditProfile.tsx
│   │   │   │   ├── comment/         # Componentes de comentarios
│   │   │   │   │   ├── CommentList.tsx
│   │   │   │   │   ├── CommentItem.tsx
│   │   │   │   │   └── CommentForm.tsx
│   │   │   │   ├── search/          # Componentes de búsqueda
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── SearchResults.tsx
│   │   │   │   │   └── FilterPanel.tsx
│   │   │   │   └── layout/          # Componentes de layout
│   │   │   │       ├── Header.tsx
│   │   │   │       ├── Navbar.tsx
│   │   │   │       ├── Sidebar.tsx
│   │   │   │       └── Layout.tsx
│   │   │   ├── pages/               # Páginas/Vistas
│   │   │   │   ├── Home.tsx         # Feed principal
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── ShotDetail.tsx
│   │   │   │   ├── CreateShot.tsx
│   │   │   │   ├── EditShot.tsx
│   │   │   │   ├── Search.tsx
│   │   │   │   ├── Explore.tsx
│   │   │   │   └── NotFound.tsx
│   │   │   ├── hooks/               # Custom hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useShots.ts
│   │   │   │   ├── useProfile.ts
│   │   │   │   ├── useFollow.ts
│   │   │   │   ├── useLike.ts
│   │   │   │   ├── useComments.ts
│   │   │   │   ├── useInfiniteScroll.ts
│   │   │   │   ├── useImageUpload.ts
│   │   │   │   └── useOnlineStatus.ts
│   │   │   ├── models/              # Effector stores (state management)
│   │   │   │   ├── auth/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   ├── events.ts
│   │   │   │   │   └── init.ts
│   │   │   │   ├── shots/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   ├── events.ts
│   │   │   │   │   └── init.ts
│   │   │   │   ├── profile/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   ├── events.ts
│   │   │   │   │   └── init.ts
│   │   │   │   ├── comments/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   ├── events.ts
│   │   │   │   │   └── init.ts
│   │   │   │   ├── ui/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   └── events.ts
│   │   │   │   └── sync/            # Offline sync
│   │   │   │       ├── index.ts
│   │   │   │       ├── stores.ts
│   │   │   │       ├── events.ts
│   │   │   │       └── init.ts
│   │   │   ├── services/            # API clients
│   │   │   │   ├── api.ts           # Axios/fetch config base
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── shot.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── comment.service.ts
│   │   │   │   └── upload.service.ts
│   │   │   ├── lib/                 # Utilidades y helpers
│   │   │   │   ├── validation.ts    # Schemas de Zod
│   │   │   │   ├── utils.ts         # Funciones helper
│   │   │   │   ├── constants.ts     # Constantes
│   │   │   │   ├── queryClient.ts   # TanStack Query config
│   │   │   │   ├── axios.ts         # Axios instance
│   │   │   │   └── indexeddb.ts     # Dexie DB instance
│   │   │   ├── types/               # TypeScript types
│   │   │   │   ├── user.ts
│   │   │   │   ├── shot.ts
│   │   │   │   ├── comment.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── index.ts
│   │   │   ├── App.tsx              # App principal
│   │   │   ├── main.tsx             # Entry point
│   │   │   ├── routes.tsx           # Definición de rutas
│   │   │   └── index.css            # Estilos globales + Tailwind
│   │   ├── .env.example
│   │   ├── .env.local
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── .eslintrc.cjs
│   │   └── registerSW.ts            # Service Worker registration
│   │
│   └── api/                          # Backend Node.js
│       ├── src/
│       │   ├── controllers/          # Request handlers
│       │   │   ├── auth.controller.ts
│       │   │   ├── user.controller.ts
│       │   │   ├── shot.controller.ts
│       │   │   ├── comment.controller.ts
│       │   │   └── follow.controller.ts
│       │   ├── routes/               # Express routes
│       │   │   ├── auth.routes.ts
│       │   │   ├── user.routes.ts
│       │   │   ├── shot.routes.ts
│       │   │   ├── comment.routes.ts
│       │   │   ├── follow.routes.ts
│       │   │   └── index.ts
│       │   ├── middleware/           # Express middleware
│       │   │   ├── auth.middleware.ts
│       │   │   ├── validation.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   ├── upload.middleware.ts
│       │   │   └── rateLimit.middleware.ts
│       │   ├── services/             # Business logic
│       │   │   ├── auth.service.ts
│       │   │   ├── user.service.ts
│       │   │   ├── shot.service.ts
│       │   │   ├── comment.service.ts
│       │   │   ├── follow.service.ts
│       │   │   ├── upload.service.ts
│       │   │   └── email.service.ts
│       │   ├── lib/                  # Utilidades
│       │   │   ├── prisma.ts         # Prisma client
│       │   │   ├── jwt.ts            # JWT helpers
│       │   │   ├── bcrypt.ts         # Password hashing
│       │   │   ├── validation.ts     # Zod schemas
│       │   │   ├── cloudinary.ts     # Cloudinary config
│       │   │   └── logger.ts         # Winston/Pino logger
│       │   ├── types/                # TypeScript types
│       │   │   ├── express.d.ts      # Express type extensions
│       │   │   ├── jwt.ts
│       │   │   └── index.ts
│       │   ├── config/               # Configuración
│       │   │   ├── database.ts
│       │   │   ├── cloudinary.ts
│       │   │   ├── cors.ts
│       │   │   └── index.ts
│       │   ├── utils/                # Helper functions
│       │   │   ├── apiResponse.ts
│       │   │   ├── errors.ts
│       │   │   └── constants.ts
│       │   ├── app.ts                # Express app setup
│       │   └── server.ts             # Server entry point
│       ├── prisma/
│       │   ├── schema.prisma         # Prisma schema
│       │   ├── migrations/           # DB migrations
│       │   └── seed.ts               # Seed data
│       ├── tests/                    # Tests
│       │   ├── unit/
│       │   ├── integration/
│       │   └── e2e/
│       ├── .env.example
│       ├── .env
│       ├── package.json
│       ├── tsconfig.json
│       ├── .eslintrc.cjs
│       └── nodemon.json
│
├── packages/                         # Código compartido (opcional)
│   └── shared/
│       ├── src/
│       │   ├── types/               # Types compartidos
│       │   ├── validation/          # Schemas Zod compartidos
│       │   └── utils/               # Utils compartidos
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
├── package.json                      # Root package.json (workspace)
├── pnpm-workspace.yaml              # o npm/yarn workspaces
├── turbo.json                       # Turbo config (opcional)
├── README.md
├── CLAUDE.md
├── PROJECT_SPEC.md
└── FOLDER_STRUCTURE.md
```

## Estructura Alternativa (Repos Separados)

Si prefieres mantener frontend y backend en repositorios separados:

### Frontend Repo
```
badshot-web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── services/
│   ├── lib/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Backend Repo
```
badshot-api/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── lib/
│   ├── types/
│   ├── config/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── prisma/
├── tests/
├── package.json
└── tsconfig.json
```

## Recomendaciones

1. **Monorepo**: Recomendado para este proyecto
   - Facilita compartir tipos entre frontend y backend
   - Simplifica el desarrollo local
   - Mejor para equipos pequeños
   - Usa pnpm workspaces o npm workspaces

2. **Naming Conventions**:
   - Componentes: PascalCase (ShotCard.tsx)
   - Hooks: camelCase con prefix 'use' (useAuth.ts)
   - Services: camelCase con suffix '.service' (auth.service.ts)
   - Types/Interfaces: PascalCase (User, Shot, ApiResponse)

3. **Organización**:
   - Coloca features complejas en carpetas por feature
   - Mantén componentes UI genéricos en `components/ui/`
   - Separa lógica de negocio en services
   - Usa barrel exports (index.ts) para imports limpios

4. **Testing**:
   - Tests unitarios junto a los archivos: `ShotCard.test.tsx`
   - Tests de integración en carpeta `tests/`
   - E2E con Playwright o Cypress en carpeta separada
