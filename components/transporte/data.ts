// Datos compartidos para el módulo de Transporte

export const subgerenciasData = [
  { 
    nombre: "Subgerencia de Transportes", 
    soles: 277300, 
    cantidad: 1492, 
    metaSoles: 400000, 
    metaCantidad: 2000, 
    color: "#3b82f6" 
  },
  { 
    nombre: "Subgerencia de Fiscalización", 
    soles: 145000, 
    cantidad: 850, 
    metaSoles: 190000, 
    metaCantidad: 1100, 
    color: "#f97316" 
  },
  { 
    nombre: "Subgerencia de Tránsito y Movilidad Urbana", 
    soles: 210000, 
    cantidad: 3150, 
    metaSoles: 550000, 
    metaCantidad: 5200, 
    color: "#10b981" 
  }
]

// Datos de Subgerencia de Transportes
export const transportesDetalles = [
  { 
    tipo: "Transporte Especial", 
    soles: 180000, 
    cantidad: 970,
    subtipos: [
      { subtipo: "Transporte Especial de Trabajadores", soles: 63000, cantidad: 330 },
      { subtipo: "Transporte Especial de Turismo", soles: 57000, cantidad: 300 },
      { subtipo: "Transporte Especial Estudiantes", soles: 48000, cantidad: 270 },
      { subtipo: "Carga/Descarga", soles: 12000, cantidad: 70 }
    ]
  },
  { 
    tipo: "Transporte Urbano", 
    soles: 53000, 
    cantidad: 255,
    subtipos: [
      { subtipo: "Sustitución", soles: 20000, cantidad: 90 },
      { subtipo: "Habilitación", soles: 15000, cantidad: 80 },
      { subtipo: "Autorización", soles: 18000, cantidad: 85 }
    ]
  },
  { 
    tipo: "Vehículos Menores", 
    soles: 36000, 
    cantidad: 210,
    subtipos: [
      { subtipo: "Renovación", soles: 10000, cantidad: 60 },
      { subtipo: "Incremento de flota", soles: 8000, cantidad: 45 },
      { subtipo: "Sustitución de flota", soles: 7000, cantidad: 40 },
      { subtipo: "Emisión TUC", soles: 6000, cantidad: 35 },
      { subtipo: "Renovación TUC", soles: 5000, cantidad: 30 }
    ]
  },
  { 
    tipo: "Taxis", 
    soles: 8300, 
    cantidad: 57,
    subtipos: [
      { subtipo: "Taxis Dispersos", soles: 3500, cantidad: 22 },
      { subtipo: "Taxis Remix", soles: 4800, cantidad: 35 }
    ]
  }
]

// Datos de Subgerencia de Fiscalización
export const fiscalizacionDetalles = [
  { 
    tipo: "Intervenciones", 
    soles: 145000, 
    cantidad: 850,
    subtipos: [
      { subtipo: "C-1: Prestar servicios en un vehículo no habilitado", soles: 55000, cantidad: 330, recaudado: 55000, pendiente: 15000, proyectado: 70000 },
      { subtipo: "C-3: Por estacionarse en zonas prohibidas", soles: 42000, cantidad: 250, recaudado: 42000, pendiente: 8000, proyectado: 50000 },
      { subtipo: "C-09: Por usar equipos de sonido superando los decibles permitidos", soles: 33000, cantidad: 190, recaudado: 33000, pendiente: 7000, proyectado: 40000 },
      { subtipo: "T-05: Circular con unidades vehiculares sin los elementos", soles: 5000, cantidad: 30, recaudado: 5000, pendiente: 5000, proyectado: 10000 },
      { subtipo: "T-21: Por utilizar la vía pública como paradero", soles: 6000, cantidad: 35, recaudado: 6000, pendiente: 4000, proyectado: 10000 },
      { subtipo: "F-01: Prestar servicio de transporte de persona sin contar", soles: 4000, cantidad: 15, recaudado: 4000, pendiente: 6000, proyectado: 10000 }
    ]
  }
]

// Datos de Subgerencia de Tránsito y Movilidad Urbana
export const transitoDetalles = [
  { 
    tipo: "Licencia Conducir Clase B-IIB", 
    soles: 155000, 
    cantidad: 2550,
    subtipos: [
      { subtipo: "Emisión", soles: 80000, cantidad: 1200 },
      { subtipo: "Revalidación", soles: 45000, cantidad: 750 },
      { subtipo: "Duplicado", soles: 15000, cantidad: 300 },
      { subtipo: "Reprogramaciones", soles: 15000, cantidad: 300 }
    ]
  },
  { 
    tipo: "Licencia Conducir Clase B-IIC", 
    soles: 55000, 
    cantidad: 600,
    subtipos: [
      { subtipo: "Emisión", soles: 35000, cantidad: 400 },
      { subtipo: "Revalidación", soles: 15000, cantidad: 150 },
      { subtipo: "Duplicado", soles: 5000, cantidad: 50 }
    ]
  }
]

// Datos de Señalización Horizontal
export const senalizacionMensualData = [
  { mes: "Enero", m2: 4200 },
  { mes: "Febrero", m2: 4300 },
  { mes: "Marzo", m2: 4600 },
  { mes: "Abril", m2: 4800 },
  { mes: "Mayo", m2: 4400 },
  { mes: "Junio", m2: 4100 },
  { mes: "Julio", m2: 4000 },
  { mes: "Agosto", m2: 3900 },
  { mes: "Septiembre", m2: 3800 },
  { mes: "Octubre", m2: 3700 },
  { mes: "Noviembre", m2: 3600 },
  { mes: "Diciembre", m2: 4600 }
]

export const senalTiposConfig = [
  { tipo: "Zonas Rígidas", weight: 0.22 },
  { tipo: "Línea Separadora", weight: 0.21 },
  { tipo: "Paso Zebra (Peatonal)", weight: 0.2 },
  { tipo: "Línea de Parada", weight: 0.19 },
  { tipo: "Flecha Direccional", weight: 0.18 }
]

// Datos de Capacitación
export const capacitacionMensualBaseData = [
  { mes: "Enero", vm: 1560, taxis: 624, tu: 416 },
  { mes: "Febrero", vm: 1620, taxis: 648, tu: 432 },
  { mes: "Marzo", vm: 1680, taxis: 672, tu: 448 },
  { mes: "Abril", vm: 1530, taxis: 612, tu: 408 },
  { mes: "Mayo", vm: 1500, taxis: 600, tu: 400 },
  { mes: "Junio", vm: 1470, taxis: 588, tu: 392 },
  { mes: "Julio", vm: 1440, taxis: 576, tu: 384 },
  { mes: "Agosto", vm: 1410, taxis: 564, tu: 376 },
  { mes: "Septiembre", vm: 1380, taxis: 552, tu: 368 },
  { mes: "Octubre", vm: 1350, taxis: 540, tu: 360 },
  { mes: "Noviembre", vm: 1320, taxis: 528, tu: 352 },
  { mes: "Diciembre", vm: 1290, taxis: 516, tu: 344 }
]

export const capacitacionTemasConfig = [
  { tema: "Programa de Seguridad Vial", weight: 0.4 },
  { tema: "Protocolo de Acoso Sexual", weight: 0.3 },
  { tema: "Talleres de Seguridad Vial", weight: 0.3 }
]

// Opciones de período
export const periodoOptions = [
  { value: "Todos", label: "Todos" },
  { value: "Enero", label: "Ene" },
  { value: "Febrero", label: "Feb" },
  { value: "Marzo", label: "Mar" },
  { value: "Abril", label: "Abr" },
  { value: "Mayo", label: "May" },
  { value: "Junio", label: "Jun" },
  { value: "Julio", label: "Jul" },
  { value: "Agosto", label: "Ago" },
  { value: "Septiembre", label: "Sep" },
  { value: "Octubre", label: "Oct" },
  { value: "Noviembre", label: "Nov" },
  { value: "Diciembre", label: "Dic" }
]

// Helper para generar opciones de años
export const getYearOptions = (baseYear: number) => {
  return [baseYear - 2, baseYear - 1, baseYear, baseYear + 1, baseYear + 2].map(String)
}

// Helper para obtener resumen de períodos seleccionados
export const getSelectedPeriodSummary = (filterPeriodos: string[]) => {
  if (filterPeriodos.includes("Todos") || filterPeriodos.length === 0) return "Todos"
  return periodoOptions
    .filter((p) => filterPeriodos.includes(p.value))
    .map((p) => p.label)
    .join(", ") || "Seleccionar"
}
