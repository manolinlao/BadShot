# 1. Terminar el dominio (lo siguiente que haría) "Dejar el dominio realmente bien modelado."

# 2. Definir mejor el modelo

Ahora mismo Shot tiene objetos anónimos:
Yo los convertiría en tipos propios:

- Coffee
- Recipe
- ShotLocation
- User

# 3. Mejorar la gestión de fotos

Ya funciona, pero aún hay margen:

- liberar URL.createObjectURL() con URL.revokeObjectURL();
- generar miniaturas;
- comprimir imágenes antes de guardarlas.

# 4. Funcionalidades reales

Una vez la base esté limpia, empezaría a añadir valor a BadShot.

Por ejemplo:

- búsqueda;
- filtros (origen, tostador, puntuación);
- favoritos;
- estadísticas.

# 5. Backend

Solo cuando el frontend esté cómodo.

Gracias a la arquitectura que has montado, el cambio será principalmente sustituir la implementación de api/.
A partir de ahora intentaría tratar BadShot como si fuera un producto de verdad.
Cada nueva funcionalidad seguiría este orden:

- ¿Necesito cambiar el modelo (types o domain)?
- ¿Necesito cambiar el estado (state)?
- ¿Necesito cambiar la persistencia (api)?
- ¿Solo entonces toco los componentes (components).

Es un flujo muy parecido al que se sigue en proyectos grandes y evita que la lógica termine escondida dentro de React.
