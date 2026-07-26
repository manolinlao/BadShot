# Plan de trabajo BadShot

Objetivo: cerrar lo importante sin dispersarnos.  
La idea es terminar los puntos de riesgo del frontend que afectan al flujo real de publicar una shot y, en cuanto eso quede estable, empezar backend mínimo.

## Prioridad general

1. Pulir captura desde móvil
2. Pulir localización
3. Congelar el frontend base
4. Empezar backend mínimo viable
5. Volver a iterar sobre producto

## Fase 1 - Cámara móvil

Meta: que hacer una foto desde el móvil funcione bien en condiciones reales.

Tareas:

- Abrir cámara correctamente en iPhone y Android
- Revisar permisos y mensajes de error
- Añadir fallback a galería si la cámara falla
- Comprobar preview antes de publicar
- Verificar que el flujo no rompe en navegadores móviles habituales

Hecho cuando:

- El usuario puede tomar o elegir una foto sin bloquearse
- Si la cámara falla, existe una salida clara
- El flujo se siente confiable en móvil

## Fase 2 - Localización

Meta: guardar ubicación de forma útil sin obligar al usuario.

Tareas:

- Pedir permiso de forma clara
- Capturar `lat/lng`
- Guardar la ubicación junto a la shot
- Añadir fallback manual si el usuario rechaza permisos
- Evitar que la localización bloquee el resto del flujo

Hecho cuando:

- La app puede guardar ubicación real cuando está disponible
- El usuario puede continuar si no quiere compartir ubicación
- La experiencia sigue siendo simple

## Fase 3 - Congelar frontend base

Meta: dejar de tocar frontend por inercia y considerar el núcleo visual suficientemente cerrado.

Tareas:

- Revisar solo bugs visibles de uso
- No añadir más capas de UI sin necesidad
- Dejar estable el flujo de crear, ver y editar shots
- Resolver solo fricciones reales detectadas al probar

Hecho cuando:

- El frontend principal ya no depende de cambios grandes para seguir avanzando
- Los flujos clave se sienten estables

## Fase 4 - Backend mínimo viable

Meta: habilitar persistencia real y empezar a salir del modo local.

Tareas:

- Auth mínima
- Crear shot en backend
- Subida de imagen
- Guardar ubicación y datos del shot
- Feed básico desde API

Hecho cuando:

- La app puede crear y listar shots desde backend
- La subida de imágenes ya no depende solo del almacenamiento local

## Regla de decisión

Si una tarea afecta directamente a cómo se crea una shot, se hace antes de abrir más features.

Si una tarea es solo pulido visual o detalle secundario, se deja para después.

## Orden recomendado de ejecución

- Semana 1: cámara móvil
- Semana 2: localización y fallback manual
- Semana 3: estabilización del frontend base
- Semana 4: backend mínimo

