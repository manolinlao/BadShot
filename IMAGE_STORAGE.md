# Estrategia de imágenes

## Objetivo

Las imágenes de los shots deben poder verse desde distintos navegadores y dispositivos.

Por eso no basta con guardarlas únicamente en el navegador.

## Estrategia actual

Usamos dos copias con responsabilidades diferentes:

```text
Frontend
└── Dexie / IndexedDB
    └── copia local para trabajar offline

Backend
└── apps/api/uploads
    └── archivo real guardado en el servidor

PostgreSQL
└── Shot.photoUrl
    └── dirección del archivo, no el archivo binario
```

Dexie sirve como almacenamiento local y PostgreSQL + el backend sirven como almacenamiento compartido.

## Flujo al crear un shot

```text
1. El usuario selecciona una imagen.
2. El frontend guarda una copia local en Dexie.
3. Se crea el shot en PostgreSQL.
4. El frontend sube la imagen al backend.
5. El backend guarda el archivo en apps/api/uploads.
6. El backend guarda la URL en Shot.photoUrl.
7. El frontend puede mostrar la imagen remota.
```

## Endpoint de subida

```text
POST /api/shots/:shotId/image
```

El archivo debe enviarse en un campo llamado:

```text
image
```

Se aceptan:

```text
JPG
PNG
WEBP
GIF
```

Límite actual:

```text
10 MB por imagen
```

## URL de la imagen

El backend guarda una ruta como:

```text
/uploads/archivo.jpg
```

Express sirve esos archivos mediante:

```text
http://localhost:3000/uploads/archivo.jpg
```

## Seguridad y propiedad

Solo el usuario propietario del shot puede subir o reemplazar su imagen.

El backend obtiene el `userId` del JWT y comprueba la relación:

```text
JWT.userId + Shot.id
```

El frontend nunca debe decidir por sí solo quién es el propietario.

## Git

Las imágenes de usuarios no se suben al repositorio.

La carpeta está ignorada mediante `.gitignore`:

```gitignore
apps/api/uploads
```

Sí se suben al repositorio:

- el código de subida;
- el schema de Prisma;
- las migraciones;
- la configuración del backend.

## Docker y servidor doméstico

En desarrollo las imágenes se guardan en:

```text
apps/api/uploads
```

Cuando el backend se ejecute dentro de Docker, esta carpeta debe montarse como un volumen persistente. Así las imágenes no desaparecerán al recrear el contenedor.

También habrá que incluir esta carpeta en las copias de seguridad del servidor.

## Limitaciones actuales

- Dexie y el backend mantienen copias separadas.
- Todavía no existe una cola de sincronización offline completa.
- Si se elimina un shot, hay que gestionar también su archivo físico.
- No existe todavía compresión ni generación de miniaturas.
- El almacenamiento local debe terminar funcionando como caché, no como fuente principal.

## Arquitectura objetivo

```text
PostgreSQL + almacenamiento del backend
└── fuente oficial compartida

Dexie
└── caché local y soporte offline

Frontend
└── muestra un estado unificado sincronizado
```
