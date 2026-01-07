# Plataforma de Datos - Municipalidad Provincial de Piura

## 📋 Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura de Componentes](#arquitectura-de-componentes)
- [Manejo de Estado](#manejo-de-estado)
- [Flujos de Navegación](#flujos-de-navegación)
- [Gestión de Datos](#gestión-de-datos)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Patrones y Convenciones](#patrones-y-convenciones)

---

## 📖 Descripción General

Plataforma web de visualización de indicadores para la Municipalidad Provincial de Piura. El sistema permite visualizar datos de dos áreas principales:
1. **Transporte Indicadores**: Gerencia de Transporte y Movilidad Urbana con sus 4 subgerencias
2. **Seguridad Ciudadana Indicadores**: (En desarrollo)

### Características Principales
- ✅ Navegación jerárquica por niveles (Gerencia → Subgerencias → Detalles)
- ✅ Visualización de datos con gráficos (Pie Charts, Bar Charts)
- ✅ Filtros dinámicos (año, período, estado, métrica)
- ✅ Diseño responsive y moderno
- ✅ Arquitectura modular y escalable

---

## 🛠️ Tecnologías Utilizadas

### Framework y Librerías Core
- **Next.js 14.2.16** - Framework React con App Router
- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos

### Librerías de UI y Visualización
- **Recharts** - Gráficos (PieChart, BarChart)
- **Lucide React** - Iconos
- **Radix UI** - Componentes base accesibles (Card, Dialog)

### Herramientas de Desarrollo
- **ESLint** - Linter de código
- **PostCSS** - Procesador CSS

---

## 📁 Estructura del Proyecto

```
v0-transport-infrastructure-page/
│
├── app/                          # App Router de Next.js
│   ├── page.tsx                  # Página principal (entry point)
│   ├── layout.tsx                # Layout global
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes reutilizables
│   │
│   ├── transporte/               # Módulo de Transporte
│   │   ├── data.ts               # Datos centralizados del módulo
│   │   ├── index.ts              # Exportaciones del módulo
│   │   ├── TransporteIndicadores.tsx          # Componente principal del módulo
│   │   ├── GerenciaView.tsx                   # Vista de Gerencia
│   │   ├── SubgerenciaTransporteView.tsx      # Vista Subgerencia Transporte
│   │   ├── SubgerenciaFiscalizacionView.tsx   # Vista Subgerencia Fiscalización
│   │   ├── SubgerenciaTransitoView.tsx        # Vista Subgerencia Tránsito
│   │   └── SubgerenciaEducacionView.tsx       # Vista Subgerencia Educación
│   │
│   ├── shared/                   # Componentes compartidos
│   │   ├── ManualUsoPDF.tsx      # Botón flotante de descarga PDF
│   │   └── index.ts              # Exportaciones
│   │
│   ├── ui/                       # Componentes base de UI
│   │   ├── card.tsx              # Componente Card
│   │   └── dialog.tsx            # Componente Dialog (modal)
│   │
│   ├── custom-navbar.tsx         # Barra de navegación superior
│   ├── recaudacion-filters.tsx   # Filtros de recaudación
│   ├── subgerencia-card.tsx      # Card de subgerencia con detalles
│   ├── subgerencia-detail-modal.tsx  # Modal de detalles
│   └── ...otros componentes...
│
├── public/                       # Archivos estáticos
│   └── images/                   # Imágenes del proyecto
│       ├── navbar/               # Logos de navbar
│       └── piura-city.jpg        # Imagen de fondo
│
└── package.json                  # Dependencias del proyecto
```

### Organización Modular

El proyecto sigue una **arquitectura modular** donde cada sección principal (Transporte, Seguridad) tiene su propia carpeta con:
- **Datos**: Archivo `data.ts` con toda la información
- **Componentes**: Vistas específicas de la sección
- **Index**: Exportaciones centralizadas

---

## 🏗️ Arquitectura de Componentes

### Jerarquía de Componentes

```
App (page.tsx)
│
├── CustomNavbar                  # Navbar superior con logo
│
├── MainCategorySelection         # 2 botones: Transporte / Seguridad
│   ├── Card (Transporte)
│   └── Card (Seguridad)
│
├── TransporteIndicadores         # Módulo completo de Transporte
│   │
│   ├── MenuPrincipal             # Organigrama de Gerencia + Subgerencias
│   │   ├── Card (Gerencia)
│   │   └── Cards (4 Subgerencias)
│   │
│   ├── GerenciaView              # Vista de Gerencia
│   │   ├── RecaudacionFilters
│   │   ├── PieChart (Recharts)
│   │   ├── BarChart (Recharts)
│   │   └── Tabla de datos
│   │
│   ├── SubgerenciaTransporteView
│   │   └── SubgerenciaCard       # Card con detalles y gráficos
│   │
│   ├── SubgerenciaFiscalizacionView
│   │   └── SubgerenciaCard
│   │
│   ├── SubgerenciaTransitoView
│   │   ├── Modo: recaudacion
│   │   │   └── SubgerenciaCard
│   │   └── Modo: senalizacion
│   │       ├── Filtros de período
│   │       ├── Gráficos de tipos
│   │       └── Tabla mensual
│   │
│   └── SubgerenciaEducacionView
│       ├── Filtros de período
│       ├── Gráficos de temas
│       ├── Gráficos de modo de transporte
│       └── Tabla mensual
│
├── ManualUsoPDF                  # Botón flotante (componente compartido)
│
└── LinksFlotantes                # Links a documentos (solo vista principal)
    ├── Link (Estrategia de Datos)
    └── Link (RA de Comité de Datos)
```

### Componentes Clave

#### 1. `page.tsx` (Componente Principal)
**Responsabilidad**: Entry point de la aplicación, maneja la navegación principal entre categorías.

**Estado Local**:
```typescript
const [selectedCategory, setSelectedCategory] = useState<MainCategory>(null)
const [selectedYear, setSelectedYear] = useState("2024")
```

**Renderizado Condicional**:
- Si `selectedCategory === null` → Muestra 2 cards (Transporte / Seguridad)
- Si `selectedCategory === "transporte"` → Renderiza `<TransporteIndicadores />`
- Si `selectedCategory === "seguridad"` → Muestra mensaje "En desarrollo"

#### 2. `TransporteIndicadores.tsx` (Módulo de Transporte)
**Responsabilidad**: Maneja toda la navegación interna del módulo de Transporte.

**Estado Local**:
```typescript
const [currentView, setCurrentView] = useState<ViewType>("menu")
```

**ViewType Disponibles**:
- `"menu"` - Organigrama principal
- `"gerencia"` - Selección de opciones de Gerencia
- `"gerencia-recaudacion"` - Vista de recaudación de Gerencia
- `"transporte"` - Opciones de Subgerencia Transporte
- `"transporte-recaudacion"` - Recaudación de Transporte
- `"transporte-parque"` - Parque Automotor (sin contenido)
- `"fiscalizacion"` - Opciones de Fiscalización
- `"fiscalizacion-recaudacion"` - Recaudación de Fiscalización
- `"transito"` - Opciones de Tránsito
- `"transito-recaudacion"` - Recaudación de Tránsito
- `"transito-senalizacion"` - Señalización
- `"transito-permisos"` - Permisos (sin contenido)
- `"educacion"` - Opciones de Educación
- `"educacion-capacitacion"` - Capacitación
- `"educacion-seguridad"` - Seguridad Vial (sin contenido)

**Función de Navegación**:
```typescript
const handleBack = () => {
  // Lógica para retroceder en la jerarquía
  switch (currentView) {
    case "menu": onBack() // Vuelve a la página principal
    case "gerencia": setCurrentView("menu")
    case "gerencia-recaudacion": setCurrentView("gerencia")
    // ... más casos
  }
}
```

#### 3. Componentes de Vista (GerenciaView, SubgerenciaXView)
**Responsabilidad**: Renderizar datos específicos de cada sección.

**Props Comunes**:
```typescript
interface ViewProps {
  onBack: () => void           // Función para volver atrás
  selectedYear: string         // Año seleccionado (heredado del padre)
  onYearChange?: (year: string) => void  // Solo en vistas con filtros
}
```

**Patrón de Estructura**:
```tsx
export function SubgerenciaXView({ onBack, selectedYear }: ViewProps) {
  // Estados locales de la vista
  const [localFilter, setLocalFilter] = useState(...)
  
  return (
    <div className="space-y-6">
      {/* Botón Atrás en recuadro blanco */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
        <button onClick={onBack}>
          <ArrowLeft /> Atrás
        </button>
      </div>

      {/* Contenido principal en Card */}
      <Card className="bg-white/95 backdrop-blur-sm p-8">
        {/* Datos, gráficos, tablas */}
      </Card>

      {/* Manual de Uso flotante */}
      <ManualUsoPDF />
    </div>
  )
}
```

---

## 🔄 Manejo de Estado

### Arquitectura de Estado

El proyecto utiliza **React Hooks** con estado local (`useState`) distribuido jerárquicamente:

```
┌─────────────────────────────────────┐
│ page.tsx (Estado Global)            │
│ - selectedCategory: MainCategory    │ ← Estado más alto
│ - selectedYear: string              │
└──────────────┬──────────────────────┘
               │
               ├─ Props hacia abajo (Drilling)
               │
               ↓
┌─────────────────────────────────────┐
│ TransporteIndicadores.tsx           │
│ - currentView: ViewType             │ ← Estado de navegación del módulo
└──────────────┬──────────────────────┘
               │
               ├─ Props hacia abajo
               │
               ↓
┌─────────────────────────────────────┐
│ GerenciaView / SubgerenciaView      │
│ - selectedEstado: string            │ ← Estados locales de filtros
│ - selectedMetrica: "soles"|"cantidad"│
│ - selectedSubgerencias: string[]    │
│ - selectedMonths: string[]          │
└─────────────────────────────────────┘
```

### Patrón de Comunicación

#### 1. **Props Drilling** (De Padre a Hijo)
```typescript
// page.tsx → TransporteIndicadores
<TransporteIndicadores
  onBack={() => setSelectedCategory(null)}
  selectedYear={selectedYear}
  onYearChange={setSelectedYear}
/>

// TransporteIndicadores → GerenciaView
<GerenciaView 
  onBack={handleBack} 
  selectedYear={selectedYear} 
  onYearChange={onYearChange} 
/>
```

#### 2. **Callback Functions** (De Hijo a Padre)
```typescript
// Hijo llama función del padre para cambiar estado
<button onClick={onBack}>Atrás</button>
```

### Estados por Nivel

#### **Nivel 1: page.tsx**
- `selectedCategory` - Categoría activa (null | "transporte" | "seguridad")
- `selectedYear` - Año global (compartido por todo el módulo)

#### **Nivel 2: TransporteIndicadores.tsx**
- `currentView` - Vista actual dentro del módulo de Transporte

#### **Nivel 3: Vistas Específicas**
- **GerenciaView**:
  - `selectedEstado` - Filtro de estado
  - `selectedMetrica` - Tipo de métrica ("soles" | "cantidad")
  - `selectedSubgerencias` - Subgerencias seleccionadas
  - `selectedMonths` - Meses seleccionados

- **SubgerenciaTransitoView**:
  - `senalFilterYear` - Año para señalización
  - `senalFilterPeriodos` - Períodos seleccionados
  - `isSenalPeriodoOpen` - Estado del dropdown

- **SubgerenciaEducacionView**:
  - `capFilterYear` - Año para capacitación
  - `capFilterPeriodos` - Períodos seleccionados
  - `isCapPeriodoOpen` - Estado del dropdown

### ¿Por qué No Redux/Context?

El proyecto no utiliza Redux o Context API porque:
1. **Simplicidad**: La jerarquía de componentes no es muy profunda (máximo 3 niveles)
2. **Estado Local**: Cada vista tiene su propio estado de filtros
3. **Props Drilling Limitado**: Solo se comparten `selectedYear` y funciones de navegación
4. **Mantenibilidad**: Más fácil de entender para desarrolladores nuevos

---

## 🧭 Flujos de Navegación

### Flujo Principal

```
Página Principal
    ↓
┌───────────────────┐
│ 2 Botones:        │
│ - Transporte      │
│ - Seguridad       │
└───────────────────┘
         ↓ (click Transporte)
┌─────────────────────────────────────┐
│ Organigrama (Menu Principal)        │
│ ┌─────────────────────────────┐     │
│ │ Gerencia de Transporte      │     │
│ │ y Movilidad Urbana          │     │
│ └─────────────────────────────┘     │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │ Sub  │ │ Sub  │ │ Sub  │ │ Sub  ││
│ │Trans │ │Fisc  │ │Trans │ │Educ  ││
│ └──────┘ └──────┘ └──────┘ └──────┘│
└─────────────────────────────────────┘
```

### Flujo de Subgerencia de Transporte

```
Click "Subgerencia Transporte"
    ↓
┌─────────────────────────────┐
│ Opciones:                   │
│ - Recaudación               │
│ - Parque Automotor          │
└─────────────────────────────┘
    ↓ (click Recaudación)
┌─────────────────────────────┐
│ Vista de Recaudación        │
│ - Gráfico de dona           │
│ - Tabla de detalles         │
│ - Botón "Ver detalle"       │
└─────────────────────────────┘
    ↓ (click Ver detalle)
┌─────────────────────────────┐
│ Modal con detalles          │
│ - Gráfico de torta          │
│ - Tabla de tipos            │
│ - Tabla de subtipos         │
└─────────────────────────────┘
```

### Botón "Atrás" - Lógica de Retroceso

Cada vista tiene un botón "Atrás" que retrocede un nivel en la jerarquía:

| Vista Actual | Al hacer click en "Atrás" |
|-------------|---------------------------|
| `menu` | Vuelve a página principal |
| `gerencia` | Vuelve a `menu` |
| `gerencia-recaudacion` | Vuelve a `gerencia` |
| `transporte` | Vuelve a `menu` |
| `transporte-recaudacion` | Vuelve a `transporte` |
| `fiscalizacion-recaudacion` | Vuelve a `fiscalizacion` |
| etc. | ... |

**Implementación**:
```typescript
const handleBack = () => {
  switch (currentView) {
    case "menu":
      onBack() // Llama al padre (page.tsx) para volver a la selección principal
      break
    case "transporte-recaudacion":
      setCurrentView("transporte") // Cambia vista local
      break
    // ... más casos
  }
}
```

---

## 💾 Gestión de Datos

### Centralización de Datos

Todos los datos del módulo de Transporte están en `components/transporte/data.ts`:

```typescript
// Datos de Subgerencias
export const subgerenciasData = [
  { nombre: "Subgerencia de Transportes", soles: 277300, cantidad: 1492, ... },
  { nombre: "Subgerencia de Fiscalización", soles: 145000, cantidad: 850, ... },
  { nombre: "Subgerencia de Tránsito...", soles: 210000, cantidad: 3150, ... }
]

// Detalles de Transportes
export const transportesDetalles = [
  { 
    tipo: "Transporte Especial", 
    soles: 180000, 
    cantidad: 970,
    subtipos: [
      { subtipo: "Transporte Especial de Trabajadores", soles: 63000, cantidad: 330 },
      // ... más subtipos
    ]
  },
  // ... más tipos
]

// Datos mensuales de Señalización
export const senalizacionMensualData = [
  { mes: "Enero", m2: 4200 },
  { mes: "Febrero", m2: 4300 },
  // ... más meses
]

// Helpers
export const periodoOptions = [
  { value: "Todos", label: "Todos" },
  { value: "Enero", label: "Ene" },
  // ... más períodos
]

export const getYearOptions = (baseYear: number) => {
  return [baseYear - 2, baseYear - 1, baseYear, baseYear + 1, baseYear + 2].map(String)
}
```

### Estructura de Datos

#### **Formato de Subgerencia**
```typescript
interface SubgerenciaData {
  nombre: string        // Nombre de la subgerencia
  soles: number         // Total en soles
  cantidad: number      // Total de trámites/programas
  metaSoles: number     // Meta en soles
  metaCantidad: number  // Meta en cantidad
  color: string         // Color para gráficos (hex)
}
```

#### **Formato de Detalles**
```typescript
interface DetalleData {
  tipo: string          // Tipo de trámite/programa
  soles: number         // Monto en soles
  cantidad: number      // Cantidad de trámites
  subtipos: Array<{     // Desglose por subtipo
    subtipo: string
    soles: number
    cantidad: number
  }>
}
```

### Cálculos y Transformaciones

Los componentes calculan totales y porcentajes en tiempo de renderizado:

```typescript
// Ejemplo: Calcular total de recaudación
const totalSoles = transportesDetalles.reduce((sum, d) => sum + d.soles, 0)

// Ejemplo: Filtrar datos por período
const filteredData = senalizacionMensualData.filter((item) => {
  if (senalFilterPeriodos.includes("Todos")) return true
  return senalFilterPeriodos.includes(item.mes)
})

// Ejemplo: Distribuir por pesos
const distributedData = senalTiposConfig.map((t) => ({
  tipo: t.tipo,
  m2: Math.floor(totalM2 * t.weight)
}))
```

---

## 👨‍💻 Guía de Desarrollo

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

### Agregar una Nueva Subgerencia

**1. Agregar datos en `data.ts`:**
```typescript
export const nuevaSubgerenciaDetalles = [
  { tipo: "Tipo A", soles: 10000, cantidad: 50, subtipos: [...] },
  // ... más tipos
]
```

**2. Crear componente de vista:**
```tsx
// components/transporte/SubgerenciaNuevaView.tsx
export function SubgerenciaNuevaView({ onBack, selectedYear }: ViewProps) {
  return (
    <div className="space-y-6">
      <button onClick={onBack}>Atrás</button>
      {/* Contenido */}
      <ManualUsoPDF />
    </div>
  )
}
```

**3. Agregar en `TransporteIndicadores.tsx`:**
```typescript
// Agregar tipo en ViewType
type ViewType = 
  | "menu" 
  | "nueva-subgerencia"
  | "nueva-subgerencia-recaudacion"
  // ... otros

// Agregar caso en handleBack
case "nueva-subgerencia":
  setCurrentView("menu")
  break

// Agregar botón en el menú
<Card onClick={() => setCurrentView("nueva-subgerencia")}>
  Nueva Subgerencia
</Card>

// Agregar renderizado condicional
if (currentView === "nueva-subgerencia") {
  return <SubgerenciaNuevaView onBack={handleBack} selectedYear={selectedYear} />
}
```

### Agregar un Nuevo Filtro

**1. Definir estado:**
```typescript
const [nuevoFiltro, setNuevoFiltro] = useState("default")
```

**2. Crear UI del filtro:**
```tsx
<select value={nuevoFiltro} onChange={(e) => setNuevoFiltro(e.target.value)}>
  <option value="opcion1">Opción 1</option>
  <option value="opcion2">Opción 2</option>
</select>
```

**3. Aplicar filtro a los datos:**
```typescript
const datosFiltrados = datos.filter(item => {
  if (nuevoFiltro === "default") return true
  return item.propiedad === nuevoFiltro
})
```

### Agregar un Nuevo Gráfico

```tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Categoría A", value: 400 },
  { name: "Categoría B", value: 300 }
]

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index]} />
      ))}
    </Pie>
  </PieChart>
</ResponsiveContainer>
```

---

## 📐 Patrones y Convenciones

### Nomenclatura

#### Componentes
- **PascalCase**: `TransporteIndicadores`, `GerenciaView`
- **Sufijos descriptivos**: `...View`, `...Card`, `...Modal`, `...Filters`

#### Archivos
- **Componentes**: `ComponentName.tsx`
- **Datos**: `data.ts`
- **Tipos**: `types.ts`
- **Índices**: `index.ts`

#### Variables y Funciones
- **camelCase**: `selectedYear`, `handleBack`, `totalSoles`
- **Booleanos**: Prefijo `is...` o `has...` → `isOpen`, `hasError`
- **Handlers**: Prefijo `handle...` → `handleClick`, `handleChange`
- **Callbacks**: Prefijo `on...` → `onBack`, `onYearChange`

### Estilos con Tailwind CSS

#### Clases Comunes
```tsx
// Contenedor principal con espaciado
<div className="space-y-6">

// Card con fondo blanco semitransparente
<Card className="bg-white/95 backdrop-blur-sm p-8">

// Botón con hover
<button className="text-blue-600 hover:text-blue-800 transition-colors">

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Botón "Atrás" en recuadro
<div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
  <button className="flex items-center gap-2">
    <ArrowLeft className="w-5 h-5" />
    Atrás
  </button>
</div>
```

### Estructura de Componente

```tsx
"use client" // Si usa hooks de React

import { useState } from "react"
import { ComponentA } from "./ComponentA"
// ... más imports

interface ComponentProps {
  prop1: string
  prop2: number
  onAction: () => void
}

export function MyComponent({ prop1, prop2, onAction }: ComponentProps) {
  // 1. Estados
  const [state1, setState1] = useState(initialValue)
  
  // 2. Cálculos derivados
  const computed = useMemo(() => calculate(state1), [state1])
  
  // 3. Handlers
  const handleClick = () => {
    // lógica
  }
  
  // 4. Renderizado condicional temprano
  if (condicion) {
    return <EarlyReturn />
  }
  
  // 5. Renderizado principal
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Manejo de Errores y Estados Vacíos

```tsx
// Sin datos
{data.length === 0 && (
  <div className="text-center text-gray-500 py-12">
    <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <p className="text-lg font-medium">No hay datos disponibles</p>
  </div>
)}

// Contenido próximamente
<Card className="bg-white/95 backdrop-blur-sm p-8">
  <div className="text-center text-gray-500 py-12">
    <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <p className="text-lg font-medium">Contenido próximamente</p>
    <p className="text-sm">Esta sección está en desarrollo</p>
  </div>
</Card>
```

### TypeScript Best Practices

```typescript
// Tipos específicos en lugar de any
type ViewType = "menu" | "gerencia" | "fiscalizacion" // ✅ Union type
const view: any = "menu" // ❌ Evitar any

// Interfaces para props
interface Props {
  name: string
  age: number
  onUpdate: (value: string) => void
}

// Tipos de retorno explícitos en funciones importantes
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.value, 0)
}

// Optional properties con ?
interface Config {
  required: string
  optional?: number
}
```

---

## 🎨 Sistema de Colores

### Colores por Subgerencia
```typescript
const COLORS = {
  gerencia: "#f97316",      // Naranja
  transporte: "#06b6d4",    // Cyan
  fiscalizacion: "#10b981", // Verde
  transito: "#9333ea",      // Morado
  educacion: "#ef4444"      // Rojo
}
```

### Colores de Gráficos
- **Recaudado**: `#16a34a` (Verde)
- **Por Recaudar**: `#ef4444` (Rojo)
- **Proyectado**: `#3b82f6` (Azul)
- **Acumulado**: `#0ea5e9` (Azul cielo)

---

## 📱 Responsive Design

### Breakpoints de Tailwind

```css
sm: 640px   /* Tablet pequeña */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeño */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Patrones Responsive Comunes

```tsx
// Grid que se adapta
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Texto que escala
<h1 className="text-2xl md:text-4xl lg:text-5xl">

// Padding responsivo
<div className="px-4 sm:px-6 md:px-8 lg:px-12">

// Ocultar en móvil
<div className="hidden md:block">

// Mostrar solo en móvil
<div className="block md:hidden">
```

---

## 🐛 Debugging y Troubleshooting

### Problemas Comunes

#### 1. **El botón "Atrás" no funciona**
- Verificar que `handleBack()` tiene el caso correcto en el `switch`
- Verificar que `onBack` está definido en las props

#### 2. **Los filtros no actualizan los datos**
- Verificar que los datos filtrados se están usando en el renderizado
- Verificar que el estado se actualiza correctamente con `setState`

#### 3. **El gráfico no se muestra**
- Verificar que los datos tienen el formato correcto
- Verificar que Recharts está importado correctamente
- Revisar la consola del navegador para errores

#### 4. **Errores de TypeScript**
- Verificar que las props tienen los tipos correctos
- Verificar que las interfaces están bien definidas

### Console Logs Útiles

```typescript
// Debugging de estado
console.log("Current view:", currentView)
console.log("Filtered data:", filteredData)

// Debugging de cálculos
console.log("Total soles:", totalSoles)
console.log("Percentage:", (value / total) * 100)
```

---

## 🚀 Próximos Pasos y Mejoras

### Funcionalidades Pendientes
- [ ] Implementar módulo de "Seguridad Ciudadana Indicadores"
- [ ] Agregar contenido a secciones "Parque Automotor", "Permisos", "Seguridad Vial"
- [ ] Implementar descarga de PDF real en "Manual de Uso"
- [ ] Agregar links reales a "Estrategia de Datos" y "RA de Comité de Datos"

### Mejoras Técnicas
- [ ] Implementar Context API si el estado crece
- [ ] Agregar tests unitarios con Jest
- [ ] Agregar tests E2E con Playwright
- [ ] Optimizar imágenes con next/image
- [ ] Agregar loading states
- [ ] Implementar error boundaries

### Mejoras de UX
- [ ] Agregar animaciones de transición entre vistas
- [ ] Agregar tooltips explicativos
- [ ] Mejorar accesibilidad (ARIA labels, keyboard navigation)
- [ ] Agregar modo oscuro

---

## 📞 Contacto y Soporte

Para preguntas o issues:
1. Revisar esta documentación
2. Revisar el código con los comentarios inline
3. Contactar al equipo de desarrollo

---

## 📄 Licencia

Este proyecto es propiedad de la **Municipalidad Provincial de Piura**.

---

**Última actualización**: Enero 2026  
**Versión**: 1.0.0  
**Mantenedor**: Equipo de Desarrollo MPP
