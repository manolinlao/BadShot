# Rueda de Sabores - Especificación Técnica

## Concepto

Implementación de una rueda de sabores interactiva basada en la **SCA Coffee Taster's Flavor Wheel** para que los usuarios puedan categorizar y describir visualmente el perfil de sabor de sus espressos.

## Estructura de Datos

### Categorías Principales (Tier 1)
1. **Frutal** (Fruity)
2. **Agrio/Fermentado** (Sour/Fermented)
3. **Vegetal** (Green/Vegetative)
4. **Otros** (Other)
5. **Tostado** (Roasted)
6. **Especiado** (Spices)
7. **Nueces/Cacao** (Nutty/Cocoa)
8. **Dulce** (Sweet)
9. **Floral** (Floral)

### Subcategorías (Tier 2 y 3)

```typescript
interface FlavorCategory {
  id: string;
  name: string;
  color: string; // Color hex para la visualización
  subcategories: FlavorSubcategory[];
}

interface FlavorSubcategory {
  id: string;
  name: string;
  descriptors: string[]; // Descriptores específicos
}

// Ejemplo: Frutal
{
  id: "fruity",
  name: "Frutal",
  color: "#FF6B9D",
  subcategories: [
    {
      id: "berry",
      name: "Frutos del bosque",
      descriptors: ["Mora", "Arándano", "Frambuesa", "Fresa"]
    },
    {
      id: "dried-fruit",
      name: "Fruta seca",
      descriptors: ["Pasas", "Ciruela", "Dátil", "Higo"]
    },
    {
      id: "citrus",
      name: "Cítricos",
      descriptors: ["Limón", "Naranja", "Pomelo", "Lima"]
    },
    {
      id: "stone-fruit",
      name: "Fruta de hueso",
      descriptors: ["Cereza", "Melocotón", "Albaricoque", "Ciruela"]
    },
    {
      id: "tropical",
      name: "Tropical",
      descriptors: ["Piña", "Mango", "Papaya", "Maracuyá"]
    }
  ]
}
```

## Modelo de Datos en Base de Datos

### Opción 1: Estructura Flexible (Recomendada para MVP)

```prisma
// Shot con flavorProfile como JSON
model Shot {
  // ... campos existentes
  flavorProfile Json? // Nullable para mantener retrocompatibilidad
}
```

**Formato JSON:**
```typescript
{
  flavors: [
    {
      category: "fruity",
      subcategory: "citrus",
      descriptor: "Limón",
      intensity: 7 // Escala 1-10
    },
    {
      category: "sweet",
      subcategory: "chocolate",
      descriptor: "Cacao",
      intensity: 9
    }
  ],
  // Agregados para búsqueda
  primaryCategories: ["fruity", "sweet"], // Para filtros
  dominantFlavor: "sweet" // La categoría con mayor intensidad total
}
```

### Opción 2: Estructura Relacional (Para Fase Avanzada)

```prisma
model FlavorCategory {
  id            String              @id @default(uuid())
  name          String              @unique
  color         String
  subcategories FlavorSubcategory[]
}

model FlavorSubcategory {
  id          String         @id @default(uuid())
  name        String
  categoryId  String
  category    FlavorCategory @relation(fields: [categoryId], references: [id])
  descriptors String[] // Array de strings en PostgreSQL
  shotFlavors ShotFlavor[]
}

model ShotFlavor {
  id              String            @id @default(uuid())
  shotId          String
  shot            Shot              @relation(fields: [shotId], references: [id])
  subcategoryId   String
  subcategory     FlavorSubcategory @relation(fields: [subcategoryId], references: [id])
  descriptor      String
  intensity       Int // 1-10
  
  @@unique([shotId, subcategoryId, descriptor])
}

// Actualizar modelo Shot
model Shot {
  // ... campos existentes
  flavors ShotFlavor[]
}
```

## UI/UX - Componente Interactivo

### Vista de Selección (al crear/editar shot)

**Componente: FlavorWheelSelector**

```
┌──────────────────────────────────────┐
│      Selecciona Sabores              │
│                                      │
│  ┌────────────────────────────────┐ │
│  │                                │ │
│  │     [Rueda circular SVG]       │ │ ← Sectores clickeables
│  │                                │ │
│  └────────────────────────────────┘ │
│                                      │
│  Sabores seleccionados:              │
│  ┌─────────────────────────────────┐│
│  │ 🍋 Limón (Cítrico)      ████████││ ← Slider intensidad
│  │ 🍫 Cacao (Chocolate)    ██████  ││
│  │ 🌸 Floral               ████    ││
│  └─────────────────────────────────┘│
│                                      │
│  [+ Añadir otro sabor]               │
└──────────────────────────────────────┘
```

**Alternativa Simplificada (mejor para mobile):**
- Lista categorizada en lugar de rueda circular
- Chips clickeables organizados por categoría
- Más accesible y responsive

### Vista de Perfil (en el shot publicado)

**Componente: FlavorProfileDisplay**

```
┌──────────────────────────────────────┐
│  Perfil de Sabor                     │
│                                      │
│  🍋 Cítrico      ████████  8/10      │
│  🍫 Chocolate    ██████    6/10      │
│  🌸 Floral       ████      4/10      │
│                                      │
│  Sabores: Limón, Cacao, Jazmín       │
└──────────────────────────────────────┘
```

**Visualización Avanzada (Fase 3):**
- Gráfico radar/spider chart con las categorías principales
- Comparador de perfiles entre shots

## Features del Componente

### Fase 2 (MVP de Rueda de Sabores)

1. **Selector Interactivo**
   - Búsqueda/filtro de sabores por nombre
   - Selección múltiple (3-5 sabores recomendados)
   - Slider de intensidad por sabor
   - Previsualización del perfil

2. **Visualización en Shot**
   - Display compacto de top 3 sabores
   - Colores diferenciados por categoría
   - Click para expandir perfil completo

3. **Búsqueda y Filtros**
   - Filtrar feed por categoría de sabor
   - "Shots similares" basados en perfil

### Fase 3 (Análisis Avanzado)

1. **Estadísticas Personales**
   - Sabores más frecuentes en tus shots
   - Gráfico de evolución de preferencias
   - Cafés/tostadores por perfil de sabor

2. **Recomendaciones**
   - "Usuarios con gustos similares"
   - "Prueba este café" basado en tu perfil
   - Comparador de shots side-by-side

3. **Gamificación**
   - Badges por explorar categorías
   - "Paladar diverso" - muchas categorías exploradas
   - "Experto en cítricos" - muchos shots en esa categoría

## Consideraciones Técnicas

### Performance
- Rueda de sabores como JSON en DB (índice GIN en PostgreSQL para búsquedas)
- Pre-computar categorías dominantes al guardar
- Caché de agregaciones en IndexedDB (PWA)

### Accesibilidad
- Alternativa a rueda circular para screen readers
- Uso de ARIA labels
- Navegación por teclado
- Alto contraste en colores

### Internacionalización
- Traducción de categorías y descriptores
- Considerar diferencias culturales en descriptores
- API con locale support

## Datos de Referencia

### Paleta de Colores Sugerida

```typescript
const FLAVOR_COLORS = {
  fruity: "#FF6B9D",      // Rosa/Fucsia
  sour: "#FFD93D",        // Amarillo
  green: "#6BCB77",       // Verde
  other: "#9D9D9D",       // Gris
  roasted: "#8B4513",     // Marrón
  spices: "#FF8C42",      // Naranja
  nutty: "#CD853F",       // Café claro
  sweet: "#A8E6CF",       // Verde menta
  floral: "#E8B4F0"       // Lavanda
}
```

### Dataset Completo (JSON)

Crear archivo `flavor-wheel-data.json` con la estructura completa de:
- 9 categorías principales
- ~30 subcategorías
- ~100+ descriptores específicos

**Fuente de datos**: SCA Coffee Taster's Flavor Wheel (2016)
- Licencia: Uso educativo/comercial permitido con atribución
- URL: https://sca.coffee/research/coffee-taster-s-flavor-wheel

## Implementación Sugerida

### Fase 2.1: Fundamentos
1. Crear dataset de sabores (JSON static)
2. Implementar modelo flexible (JSON en DB)
3. Componente selector simplificado (lista categorizada)
4. Display básico de perfil

### Fase 2.2: Interactividad
5. Mejorar selector (búsqueda, sugerencias)
6. Añadir filtros en feed
7. "Shots similares" por sabor

### Fase 3: Avanzado
8. Visualización gráfica (radar chart)
9. Estadísticas y análisis
10. Recomendaciones ML-based

## Referencias

- **SCA Flavor Wheel**: https://sca.coffee/research/coffee-taster-s-flavor-wheel
- **Counter Culture Taster's Flavor Wheel**: Versión interactiva de referencia
- **World Coffee Research Lexicon**: Descriptores estandarizados
