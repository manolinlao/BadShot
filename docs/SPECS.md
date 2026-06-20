# BadShot — Especificación y plan de ejecución

> Fuente principal para decidir qué construir y en qué orden.
>
> Última actualización: 20 de junio de 2026.

## 1. Visión

BadShot es una red social mobile-first para registrar, compartir y descubrir
shots de espresso de café de especialidad.

La primera versión debe funcionar como una PWA, conservar los datos del usuario
cuando no haya conexión y sincronizarlos con el servidor cuando la conexión
vuelva.

## 2. Principios del producto

- La interfaz y los textos visibles para el usuario estarán en inglés.
- El producto debe ser usable primero en móvil y adaptarse a tablet y escritorio.
- Las funciones principales de creación y consulta deben tolerar una conexión
  lenta o inexistente.
- La accesibilidad forma parte de cada entrega, no de una fase posterior.
- La interfaz debe crecer mediante flujos pequeños y completos, evitando crear
  pantallas sin comportamiento real.
- Inglés y español deben estar soportados antes de cerrar el MVP.

## 3. Alcance del MVP

### Incluido

1. **Cuenta y perfil**
   - Registro e inicio de sesión con email y contraseña.
   - Consulta y edición de nombre, username, bio y avatar.
   - Sesión persistente y cierre de sesión.

2. **Shots**
   - Crear, editar, consultar y eliminar un shot propio.
   - Añadir foto, café, origen, tostador, nivel de tueste, ubicación opcional,
     dosis de entrada, bebida obtenida, tiempo, puntuación y notas de cata.
   - Guardar borradores y cambios localmente.
   - Sincronizar las operaciones pendientes al recuperar conexión.

3. **Feed social**
   - Feed cronológico paginado.
   - Like y unlike.
   - Comentarios básicos.
   - Estados claros de carga, vacío, error y offline.

4. **Perfiles y relaciones**
   - Ver el perfil y los shots de otra persona.
   - Seguir y dejar de seguir.
   - Mostrar estadísticas básicas.

5. **Exploración**
   - Buscar usuarios.
   - Buscar shots por origen o tostador.
   - Filtrar por puntuación.

6. **PWA**
   - Aplicación instalable.
   - Shell y recursos estáticos disponibles offline.
   - Datos recientes almacenados en IndexedDB.
   - Indicador de conectividad y cola de sincronización.

### Fuera del MVP

- Rueda de sabores avanzada.
- Recomendaciones algorítmicas.
- Mensajería, stories, badges y competiciones.
- Notificaciones push.
- Reviews, check-ins y mapa de cafeterías.
- Aplicaciones nativas.

Estas funciones permanecen en el roadmap y no deben bloquear la entrega del MVP.

## 4. Estado real del repositorio

### Implementado

- Monorepo npm con el frontend en `apps/web`.
- React 18, TypeScript, Vite y Tailwind CSS.
- Layout responsive con navegación móvil y de escritorio.
- Rutas de home, login, registro, creación, edición y perfil.
- Feed con datos mock y shots creados en el navegador.
- Creación y edición local de shots con foto, puntuación, ubicación, café,
  receta y notas.
- Eliminación local con confirmación.
- Persistencia temporal de shots mediante `localStorage`.
- Componentes reutilizables para tarjeta, foto, puntuación, receta y panel de
  detalles.
- `npm run typecheck -w apps/web` y `npm run build -w apps/web`.

### Parcial o provisional

- Login, registro y perfil son pantallas de marcador de posición.
- El feed combina datos mock con datos locales.
- Las imágenes locales se guardan como Data URL y no tienen todavía una
  estrategia de compresión, cuota o limpieza.
- La validación del formulario solo exige una foto.
- No hay pruebas automatizadas, lint configurado ni pipeline de CI.
- El frontend usa estado React local y `localStorage`; todavía no aplica la
  arquitectura offline-first definida.

### No implementado

- `apps/api`.
- Implementación funcional de `packages/shared`.
- PostgreSQL, Prisma, JWT y Cloudinary.
- Effector, TanStack Query, Dexie y Zod.
- Service Worker, manifest e instalación PWA.
- Internacionalización inglés/español.
- Likes, comentarios, follows, búsqueda y perfiles reales.

## 5. Arquitectura objetivo

```text
React UI
  ├── Effector: sesión, conectividad, cola y estado de dominio local
  ├── TanStack Query: estado remoto, caché y mutaciones
  └── Dexie / IndexedDB: shots, borradores, caché y operaciones pendientes
          │
          ▼
Express REST API
  ├── Zod: validación compartida
  ├── Prisma: acceso a datos
  ├── JWT: autenticación
  └── Cloudinary: imágenes
          │
          ▼
      PostgreSQL
```

### Responsabilidades

- **React local state:** estado efímero de un componente o formulario.
- **Effector:** estado de cliente compartido y lógica de sincronización.
- **TanStack Query:** datos propiedad del servidor.
- **Dexie:** persistencia local y soporte offline.
- **packages/shared:** contratos, tipos y esquemas Zod compartidos.
- **API:** autorización, reglas de negocio y persistencia definitiva.

Todas las respuestas de la API deben seguir uno de estos formatos:

```ts
{ success: true, data: T }
```

```ts
{ success: false, error: { message: string, code?: string } }
```

## 6. Plan de ejecución

Cada fase debe terminar con una parte demostrable y estable. No se inicia una
fase si la anterior deja errores de TypeScript o rompe el flujo existente.

### Fase 0 — Alinear la base técnica

Objetivo: convertir el prototipo actual en una base verificable.

- [x] Mantener React Router v7 y alinear la documentación con la implementación
      real.
- [ ] Añadir ESLint y un script `lint`.
- [ ] Añadir Vitest y React Testing Library.
- [ ] Crear una prueba de humo del router y una del flujo local de shots.
- [ ] Crear el esqueleto funcional de `packages/shared`.
- [ ] Definir schemas Zod compartidos para `Shot`, `User` y respuestas API.
- [ ] Actualizar scripts raíz para que no fallen mientras `apps/api` no exista.
- [ ] Documentar variables de entorno en archivos `.env.example`.

**Finalizada cuando:** typecheck, lint, tests y build pasan desde la raíz.

### Fase 1 — Vertical local-first de shots

Objetivo: conservar el flujo actual, sustituyendo la persistencia provisional
por la arquitectura elegida.

- [ ] Instalar y configurar Dexie.
- [ ] Migrar los shots de `localStorage` a IndexedDB sin perder datos existentes.
- [ ] Guardar imágenes de forma controlada y aplicar compresión en cliente.
- [ ] Validar creación y edición con Zod y mostrar errores accesibles.
- [ ] Introducir Effector para conectividad y cola de operaciones.
- [ ] Añadir estados de vacío, error y offline al feed.
- [ ] Probar creación, edición, eliminación, recarga y migración.

**Finalizada cuando:** un usuario puede gestionar sus shots, recargar la página
y seguir viendo sus datos sin conexión.

### Fase 2 — PWA mínima

Objetivo: hacer instalable y fiable el vertical local.

- [ ] Configurar `vite-plugin-pwa`.
- [ ] Crear manifest, iconos y metadatos.
- [ ] Cachear el app shell y los recursos estáticos.
- [ ] Mostrar aviso de actualización y estado offline.
- [ ] Verificar instalación, arranque offline y actualización del Service Worker.

**Finalizada cuando:** la app se instala y el feed local abre sin red.

### Fase 3 — API, base de datos y autenticación

Objetivo: introducir identidad y persistencia remota sin romper el modo local.

- [ ] Crear `apps/api` con Express, TypeScript y manejo centralizado de errores.
- [ ] Configurar PostgreSQL y Prisma.
- [ ] Implementar `User` y sesiones con access/refresh tokens.
- [ ] Implementar registro, login, refresh, logout y `me`.
- [ ] Aplicar validación Zod, rate limiting, Helmet y CORS.
- [ ] Conectar los formularios del frontend.
- [ ] Añadir rutas protegidas y persistencia segura de sesión.
- [ ] Cubrir auth con pruebas de integración.

**Finalizada cuando:** un usuario puede crear una cuenta, volver a entrar y
cerrar sesión; los endpoints rechazan datos y accesos inválidos.

### Fase 4 — Sincronización de shots

Objetivo: convertir el vertical local en un flujo completo cliente-servidor.

- [ ] Crear CRUD de shots con autorización por propietario.
- [ ] Integrar Cloudinary y validar tipo y tamaño de imagen.
- [ ] Añadir TanStack Query y servicios `*.service.ts`.
- [ ] Sincronizar altas, cambios y eliminaciones pendientes.
- [ ] Definir IDs locales, idempotencia, reintentos y resolución de conflictos.
- [ ] Reemplazar el feed mock por API con caché IndexedDB.
- [ ] Añadir paginación.

**Finalizada cuando:** los shots creados offline se sincronizan una sola vez y
aparecen tras iniciar sesión en otro dispositivo.

### Fase 5 — Núcleo social

Objetivo: completar las relaciones básicas del MVP.

- [ ] Perfiles públicos y edición del perfil propio.
- [ ] Subida de avatar.
- [ ] Like/unlike con actualización optimista.
- [ ] Comentarios con creación y eliminación propia.
- [ ] Follow/unfollow.
- [ ] Feed cronológico y estadísticas básicas.
- [ ] Pruebas de autorización y estados optimistas.

**Finalizada cuando:** dos cuentas pueden interactuar entre sí y cada operación
mantiene un estado coherente online y offline.

### Fase 6 — Exploración, idiomas y cierre del MVP

Objetivo: completar el alcance y preparar una entrega pública.

- [ ] Buscar usuarios, orígenes y tostadores.
- [ ] Filtrar shots por puntuación.
- [ ] Añadir inglés y español sin textos incrustados en componentes.
- [ ] Revisar navegación por teclado, foco, contraste y lectores de pantalla.
- [ ] Optimizar imágenes, lazy loading y tamaño del bundle.
- [ ] Ejecutar pruebas E2E de los recorridos principales.
- [ ] Añadir CI para typecheck, lint, tests y build.
- [ ] Preparar entornos, secretos, migraciones, observabilidad y despliegue.

**Finalizada cuando:** todos los recorridos MVP pasan en móvil y escritorio,
online y offline, en inglés y español.

## 7. Orden inmediato recomendado

Las próximas tareas concretas son:

1. Corregir los scripts raíz y crear la verificación automática básica.
2. Inicializar `packages/shared` con los contratos Zod de `Shot`.
3. Migrar la persistencia de shots de `localStorage` a Dexie.
4. Añadir validación completa al formulario de creación y edición.
5. Configurar la PWA mínima.

No conviene añadir más interacción visual al feed antes de estabilizar estos
fundamentos: likes y comentarios necesitarán identidad, contratos y una
estrategia offline definida.

## 8. Decisiones pendientes

Estas decisiones deben cerrarse en la fase indicada:

| Decisión | Recomendación | Límite |
| --- | --- | --- |
| React Router | Mantener v7 y alinear la documentación con la implementación | Fase 0 |
| Política de refresh token | Cookie `httpOnly`, `secure` y `sameSite`; access token corto en memoria | Fase 3 |
| Conflictos offline | Última edición válida para campos; operaciones sociales idempotentes | Fase 4 |
| Ubicación en MVP | Texto y coordenadas opcionales; sin mapa de cafeterías | Fase 4 |
| Hosting | Elegir servicios compatibles con PostgreSQL, almacenamiento de secretos y despliegue separado | Fase 6 |

## 9. Criterios globales de aceptación

Una funcionalidad solo está terminada si:

- Tiene estados de carga, vacío, error y offline cuando correspondan.
- Valida entradas en cliente y servidor.
- No introduce errores de TypeScript, lint, tests o build.
- Es usable con teclado y controles correctamente etiquetados.
- Funciona en viewport móvil antes de considerarse para escritorio.
- No duplica tipos o reglas que pertenezcan a `packages/shared`.
- Maneja errores asíncronos de forma explícita.
- Incluye al menos pruebas del camino feliz y del fallo principal.
- Actualiza este documento si cambia el alcance o el orden del proyecto.

## 10. Documentación relacionada

- `AGENTS.md`: reglas obligatorias de arquitectura y convenciones.
- `docs/product/PROJECT_SPEC.md`: visión amplia y modelo conceptual original.
- `docs/product/FLAVOR_WHEEL_SPEC.md`: diseño de una función post-MVP.
- `docs/architecture/FOLDER_STRUCTURE.md`: estructura objetivo orientativa.
- `docs/architecture/EFFECTOR_ARCHITECTURE.md`: patrones de estado de cliente.
- `docs/architecture/PWA_SETUP.md`: referencia técnica para la PWA.
- `docs/development/DEVELOPMENT_LOG.md`: historial y decisiones ya realizadas.
- `docs/development/NEXT_STEPS.md`: plan inicial; queda reemplazado por este
  documento para el orden de ejecución.
