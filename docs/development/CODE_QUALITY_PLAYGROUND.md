# TypeScript, ESLint y Prettier en BadShot

Este documento explica para qué sirve cada herramienta y cómo puedes
experimentar con ellas dentro del proyecto sin romper nada importante.

## Resumen rápido

- `tsc` revisa tipos y errores de TypeScript.
- `eslint` revisa reglas de código y posibles malas prácticas.
- `prettier` solo formatea el código.

## Qué hace cada una

### `tsc`

`tsc` es el compilador de TypeScript. Cuando lo ejecutas en modo de chequeo,
analiza el código sin generar archivos.

Te ayuda a detectar:

- errores de sintaxis
- tipos incompatibles
- props o variables mal usadas
- imports incorrectos

Ejemplo:

```ts
const age: number = 'hola';
```

TypeScript marcará ese error porque un `number` no puede contener un string.

### `eslint`

ESLint analiza el código desde el punto de vista de calidad y reglas del
proyecto.

Te ayuda a detectar:

- variables declaradas pero no usadas
- imports innecesarios
- patrones frágiles o confusos
- usos problemáticos de hooks o estructuras de React

ESLint no sustituye a TypeScript. Se complementan.

### `prettier`

Prettier no busca errores. Solo deja el código consistente y bien formateado.

Te ayuda a:

- alinear llaves
- ordenar saltos de línea
- normalizar espacios
- evitar discusiones de estilo

## Qué hay ahora mismo en BadShot

En este repo, ahora mismo sí tienes:

- TypeScript en `apps/web`
- un script de comprobación de tipos
- Prettier en la raíz

Lo que todavía no está configurado de forma real es ESLint.

### Scripts útiles que ya existen

```bash
npm run typecheck -w apps/web
```

Revisa tipos y errores de TypeScript en el frontend.

```bash
npm run format
```

Formatea el código de todo el repo con Prettier.

## Cómo “jugar” con esto

La forma más segura de aprender es provocar un error pequeño y ver qué tool lo
detecta.

### 1. Probar TypeScript

Abre cualquier archivo `.ts` o `.tsx` dentro de `apps/web/src`.

Haz un cambio intencional como este:

```ts
const total: number = '123';
```

Luego ejecuta:

```bash
npm run typecheck -w apps/web
```

Vas a ver cómo TypeScript señala el problema.

Cuando termines, quita el error y vuelve a lanzar el comando para comprobar que
todo queda limpio.

### 2. Probar el formateo

Haz que un archivo quede desordenado a propósito:

```ts
const foo = { a: 1, b: 2 };
```

Luego ejecuta:

```bash
npm run format
```

Prettier lo dejará alineado y uniforme.

### 3. Entender ESLint aunque todavía no esté activo

Aunque ESLint no esté configurado todavía, piensa en él como el revisor de
hábitos del proyecto.

Cuando se añada, será útil para detectar cosas como:

- código muerto
- imports sin usar
- bugs típicos en React
- usos inconsistentes del estilo del equipo

## Flujo práctico recomendado

Si estás trabajando en frontend, este orden suele funcionar bien:

1. Editas el componente o la página.
2. Ejecutas `npm run typecheck -w apps/web`.
3. Ejecutas `npm run format`.
4. Cuando ESLint esté listo, también ejecutarás `npm run lint`.

## Idea mental simple

- `tsc` te dice: "esto compila o no compila".
- `eslint` te dice: "esto sigue las reglas o no".
- `prettier` te dice: "esto está formateado o no".

## Estado actual del frontend

BadShot está todavía en una fase donde estas herramientas sirven sobre todo para
dar seguridad mientras se pule la base del frontend.

Si quieres experimentar, lo mejor es hacerlo sobre componentes pequeños dentro
de `apps/web/src`, lanzar `typecheck` y observar qué pasa.
