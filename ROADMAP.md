# 2. analizar esto

Solo hace falta una fecha: `createdAt`.

Esa fecha representa el dia en que se crea la entrada del Shot.

Por tanto:

- `brewedDate` sobra;
- `brewedAt` sobra;
- `createdAt` se queda como unica fecha.

# 3. Trabajar con el location

Primero haria una version simple y controlable:

- nombre del local;
- ciudad;
- pais.

Mas adelante, si merece la pena, haria la version mas sofisticada:

- mapa o coordenadas;
- deteccion automatica de ubicacion;
- autocompletado de locales;
- boton para guardar la ubicacion actual si el navegador lo permite;
- fallback manual si no se puede detectar nada.

# 4. Funcionalidades reales

Una vez la base este limpia, empezaria a anadir valor a BadShot.

Por ejemplo:

- busqueda;
- filtros (origen, tostador, puntuacion);
- favoritos;
- estadisticas.

# 5. Backend

Solo cuando el frontend este comodo.

Gracias a la arquitectura que has montado, el cambio sera principalmente sustituir la implementacion de api/.
A partir de ahora intentaria tratar BadShot como si fuera un producto de verdad.
Cada nueva funcionalidad seguiria este orden:

- Necesito cambiar el modelo (types o domain)?
- Necesito cambiar el estado (state)?
- Necesito cambiar la persistencia (api)?
- Solo entonces toco los componentes (components).

Es un flujo muy parecido al que se sigue en proyectos grandes y evita que la logica termine escondida dentro de React.
