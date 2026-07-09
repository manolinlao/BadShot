# Roadmap BadShot v1

## Summary
Reordenar el roadmap para que siga una secuencia mas natural: primero pulir la experiencia base, despues anadir `location` simple, luego funciones reales del producto, y dejar lo avanzado y el backend para mas adelante.

## Key Changes
- **1. UI base y pulido**
  - Mejorar layout, jerarquia visual, spacing, estados vacios y consistencia general.
  - Dejar la app mas "producto" antes de sumar mas complejidad.

- **2. Location v1 simple**
  - Mantener solo la version basica:
    - nombre del local
    - ciudad
    - pais
  - No meter todavia mapa, geolocalizacion automatica, coordenadas ni autocompletado.

- **3. Funcionalidades reales**
  - Buscar shots
  - Filtrar por origen, tostador y puntuacion
  - Favoritos
  - Estadisticas basicas

- **4. Navegacion del feed**
  - Mantener paginacion o carga progresiva simple de momento.
  - Tratar el infinite scroll como mejora posterior, no como prioridad inmediata.

- **5. Backend**
  - Posponerlo hasta que el frontend este solido y el modelo de datos este claro.
  - Cuando llegue el momento, el cambio sera principalmente sustituir la capa `api/`.

## Test Plan
- Revisar que el roadmap refleje una sola direccion de producto y no mezcle ideas de MVP con ideas avanzadas.
- Comprobar que cada fase depende de la anterior de forma logica.
- Validar que `location` queda como una feature util desde ya, pero sin sobreingenieria.

## Assumptions
- La fecha del Shot seguira siendo una sola: `createdAt`.
- `location` se hara util pronto, pero en una version simple.
- El infinite scroll no es prioridad frente a UI, location y filtros.
