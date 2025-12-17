"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { TrendingUp, ArrowLeft, BarChart3 } from "lucide-react"
import { TipoDetailModal } from "./tipo-detail-modal"

interface SubtipoDetalle {
  subtipo: string
  soles?: number
  cantidad?: number
  recaudado?: number
  pendiente?: number
  proyectado?: number
}

interface DetalleNivel2 {
  tipo: string
  soles?: number
  cantidad?: number
  subtipos?: SubtipoDetalle[]
}

// Colores para el gráfico de torta
const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#f97316', // orange-500
  '#10b981', // green-500
  '#6366f1', // indigo-500 (más institucional)
  '#38bdf8', // sky-400 (celeste institucional)
  '#f59e0b', // amber-500
  '#06b6d4', // cyan-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
  '#f43f5e', // rose-500
  '#84cc16', // lime-500
  '#a855f7', // purple-500
]

// Componente de gráfico de torta
function PieChart({
  detalles,
  metrica,
  showLegend = true
}: {
  detalles: DetalleNivel2[]
  metrica: "soles" | "cantidad"
  showLegend?: boolean
}) {
  // Calcular total
  const total = detalles.reduce((sum, detalle) => {
    const value = metrica === "soles" ? (detalle.soles || 0) : (detalle.cantidad || 0)
    return sum + value
  }, 0)

  if (total === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No hay datos disponibles
      </div>
    )
  }

  // Calcular ángulos para cada segmento
  let currentAngle = 0
  const segments = detalles.map((detalle, index) => {
    const value = metrica === "soles" ? (detalle.soles || 0) : (detalle.cantidad || 0)
    const percentage = (value / total) * 100
    const angle = (percentage / 100) * 360
    const segment = {
      detalle,
      value,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }
    currentAngle += angle
    return segment
  })

  // Crear el gradiente cónico
  const gradientStops = segments.map((seg, index) => {
    const nextStart = index < segments.length - 1 ? segments[index + 1].startAngle : 360
    return `${seg.color} ${seg.startAngle}deg ${seg.endAngle}deg`
  }).join(', ')

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Gráfico circular - más pequeño en móvil */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex-shrink-0">
        <div 
          className="w-full h-full rounded-full shadow-2xl"
          style={{
            background: `conic-gradient(from 0deg, ${gradientStops})`
          }}
        />
      </div>

      {/* Leyenda debajo - compacta para móvil */}
      {showLegend && (
        <div className="w-full max-w-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {segments.map((seg, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <div 
                  className="w-4 h-4 rounded flex-shrink-0 shadow-md" 
                  style={{ backgroundColor: seg.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{seg.detalle.tipo}</p>
                  <p className="text-xs text-gray-600 font-bold">
                    {seg.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface SubgerenciaDetailModalProps {
  isOpen: boolean
  onClose: () => void
  subgerencia: string
  year: string
  metrica?: "soles" | "cantidad"
  estado: string
  detalles: DetalleNivel2[]
  totalSoles?: number
  totalCantidad?: number
}

export function SubgerenciaDetailModal({
  isOpen,
  onClose,
  subgerencia,
  year,
  metrica,
  estado,
  detalles,
  totalSoles,
  totalCantidad
}: SubgerenciaDetailModalProps) {
  const [selectedTipo, setSelectedTipo] = useState<DetalleNivel2 | null>(null)
  const [showNivel3, setShowNivel3] = useState(false)

  // Check if soles data is available
  const hasSolesData = totalSoles !== undefined && totalSoles > 0
  const currentMetrica: "soles" | "cantidad" = hasSolesData ? "soles" : "cantidad"

  const cantidadTitle = subgerencia.toLowerCase().includes("fiscaliz")
    ? "Total de Actas de Control"
    : "Total de Trámites"

  const [filterYear, setFilterYear] = useState(year)
  const [filterPeriodos, setFilterPeriodos] = useState<string[]>(["Todos"])
  const [isPeriodoOpen, setIsPeriodoOpen] = useState(false)

  const baseYear = parseInt(year, 10)
  const yearOptions = isNaN(baseYear)
    ? [year]
    : [baseYear - 2, baseYear - 1, baseYear, baseYear + 1, baseYear + 2].map(String)

  const periodoOptions = [
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
    { value: "Diciembre", label: "Dic" },
  ]

  const selectedPeriodSummary = filterPeriodos.includes("Todos")
    ? "Todos"
    : periodoOptions
        .filter((p) => filterPeriodos.includes(p.value))
        .map((p) => p.label)
        .join(", ") || "Seleccionar"

  const handleTipoClick = (detalle: DetalleNivel2) => {
    setSelectedTipo(detalle)
    setShowNivel3(true)
  }

  const groupedDetalles: DetalleNivel2[] = (() => {
    const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")

    const toGroup = (tipoValue: string): string | null => {
      const t = normalize(tipoValue)
      if (t.includes("transporte especial") || t.includes("carga/descarga") || t.includes("carga descarga")) return "Transporte Especial"
      if (t.includes("transporte urbano")) return "Transporte Urbano"
      if (t.includes("vehiculos menores") || t.includes("vehiculos menor") || t.includes("mototaxi") || t.includes("mototaxis")) {
        return "Vehículos Menores"
      }
      if (t.includes("taxis") || t.includes("taxi")) return "Taxis"
      return null
    }

    const order = ["Transporte Especial", "Transporte Urbano", "Vehículos Menores", "Taxis"]
    const buckets = new Map<string, DetalleNivel2[]>()
    for (const d of detalles) {
      const key = toGroup(d.tipo)
      if (!key) continue
      buckets.set(key, [...(buckets.get(key) ?? []), d])
    }

    const toSubtipos = (members: DetalleNivel2[], groupKey: string): SubtipoDetalle[] => {
      // Para Taxis, los subtipos son Taxis Dispersos y Taxis Remix (las tarjetas individuales)
      if (groupKey === "Taxis") {
        return members.map((m) => ({ subtipo: m.tipo, soles: m.soles, cantidad: m.cantidad }))
      }
      // Para Transporte Especial, los subtipos son las 4 categorías principales (Trabajadores, Turismo, Estudiantes, Carga/Descarga)
      if (groupKey === "Transporte Especial") {
        return members.map((m) => ({ subtipo: m.tipo, soles: m.soles, cantidad: m.cantidad }))
      }
      const withSubtipos = members.filter((m) => (m.subtipos?.length ?? 0) > 0)
      if (withSubtipos.length > 0) {
        return withSubtipos.flatMap((m) => m.subtipos ?? [])
      }
      return members.map((m) => ({ subtipo: m.tipo, soles: m.soles, cantidad: m.cantidad }))
    }

    const sum = (members: DetalleNivel2[], field: "soles" | "cantidad") =>
      members.reduce((acc, m) => acc + (m[field] ?? 0), 0)

    const result: DetalleNivel2[] = []
    for (const key of order) {
      const members = buckets.get(key) ?? []
      if (members.length === 0) continue
      result.push({
        tipo: key,
        soles: sum(members, "soles"),
        cantidad: sum(members, "cantidad"),
        subtipos: toSubtipos(members, key)
      })
    }

    return result
  })()

  const displayedDetalles: DetalleNivel2[] = (() => {
    if (subgerencia === "Subgerencia de Transportes") return groupedDetalles
    if (subgerencia === "Subgerencia de Tránsito y Movilidad Urbana") {
      const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
      const allowed = new Set(["licencia conducir clase b-iib", "licencia conducir clase b-iic"])
      return detalles.filter((d) => {
        const t = normalize(d.tipo)
        return [...allowed].some((a) => t.includes(a))
      })
    }
    return detalles
  })()

  const displayedTotalSoles = displayedDetalles.reduce((acc, d) => acc + (d.soles ?? 0), 0)
  const displayedTotalCantidad = displayedDetalles.reduce((acc, d) => acc + (d.cantidad ?? 0), 0)

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="!max-w-[100vw] !w-[100vw] md:!max-w-[95vw] md:!w-[95vw] xl:!max-w-[85vw] xl:!w-[85vw] 2xl:!max-w-[75vw] 2xl:!w-[75vw] !max-h-[90vh] p-0 flex flex-col"
        style={{ maxWidth: '100vw', width: '100vw' }}
      >
        <DialogHeader className="border-b pb-3 md:pb-4 px-3 md:px-4 lg:px-6 pt-3 md:pt-4 lg:pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all self-start"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">Atrás</span>
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap md:justify-end">
                <span className="inline-block bg-blue-100 text-blue-800 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                  NIVEL 2
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                  {year}
                </span>
                <span className="inline-block bg-purple-100 text-purple-800 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                  {estado}
                </span>
              </div>
              <DialogTitle className="text-base md:text-xl font-bold text-gray-900 leading-tight">
                {subgerencia}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Contenido principal en layout horizontal */}
        <div className="overflow-y-auto px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6">
          {/* Total destacado - compacto */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 md:p-4 rounded-lg text-white shadow-lg mb-3 md:mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
              <div className="flex items-center gap-8 flex-wrap">
                {hasSolesData ? (
                  <>
                    <div>
                      <p className="text-blue-100 text-[10px] md:text-xs font-medium mb-1">Total Recaudación</p>
                      <p className="text-xl md:text-2xl font-bold whitespace-nowrap">
                        S/ {displayedTotalSoles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-[10px] md:text-xs font-medium mb-1">{cantidadTitle}</p>
                      <p className="text-xl md:text-2xl font-bold whitespace-nowrap">
                        {displayedTotalCantidad.toLocaleString('es-PE')}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-blue-100 text-[10px] md:text-xs font-medium mb-1">{cantidadTitle}</p>
                    <p className="text-xl md:text-2xl font-bold whitespace-nowrap">
                      {displayedTotalCantidad.toLocaleString('es-PE')}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center md:items-center justify-end gap-2 md:gap-3 text-[10px] md:text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Año:</span>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y} className="text-gray-900">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-start gap-1 relative">
                  <span className="font-semibold mt-0.5">Meses/Periodo:</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPeriodoOpen((prev) => !prev)}
                      className="flex items-center gap-1 border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70 min-w-[140px] justify-between"
                    >
                      <span className="truncate text-left">
                        {selectedPeriodSummary}
                      </span>
                      <span className="text-[9px]">▼</span>
                    </button>
                    {isPeriodoOpen && (
                      <div className="absolute right-0 mt-1 max-h-56 w-56 overflow-auto rounded-md bg-white text-gray-900 shadow-lg border border-gray-200 z-20">
                        <div className="p-2 text-[11px] font-semibold text-gray-700 border-b border-gray-100">
                          Selecciona meses / periodos
                        </div>
                        <div className="p-2 flex flex-col gap-1 text-xs">
                          {periodoOptions.map((p) => {
                            const checked = filterPeriodos.includes(p.value)
                            return (
                              <label
                                key={p.value}
                                className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="h-3 w-3 accent-blue-600"
                                  checked={checked}
                                  onChange={(e) => {
                                    setFilterPeriodos((prev) => {
                                      const monthValues = periodoOptions
                                        .filter((opt) => opt.value !== "Todos")
                                        .map((opt) => opt.value)

                                      if (e.target.checked) {
                                        if (p.value === "Todos") {
                                          // Seleccionar todos los meses cuando se marca "Todos"
                                          return ["Todos", ...monthValues]
                                        }
                                        // Quitar "Todos" si estaba y agregar el mes
                                        return [...prev.filter((v) => v !== "Todos"), p.value]
                                      }

                                      // Desmarcar
                                      if (p.value === "Todos") {
                                        // Quitar 'Todos' y desmarcar todos los meses
                                        return []
                                      }

                                      const next = prev.filter((v) => v !== p.value)
                                      const remainingMonths = next.filter((v) => v !== "Todos")
                                      // Si ya no queda ningún mes seleccionado, dejamos todo vacío
                                      return remainingMonths.length === 0 ? [] : next
                                    })
                                  }}
                                />
                                <span className="text-[11px]">{p.label}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layout vertical para móvil, horizontal para desktop */}
          <div className="flex flex-col gap-4">
            {/* Detalles por tipo - grid compacto */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                <span>Detalle por Tipo de Trámite/Programa</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {(() => {
                    // Calculate total for percentages
                    const total = displayedDetalles.reduce((sum, d) => {
                      const value = hasSolesData ? (d.soles || 0) : (d.cantidad || 0)
                      return sum + value
                    }, 0)
                    
                    return displayedDetalles.map((detalle, index) => {
                      const color = CHART_COLORS[index % CHART_COLORS.length]
                      const value = hasSolesData ? (detalle.soles || 0) : (detalle.cantidad || 0)
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
                      
                      return (
                        <Card 
                          key={index} 
                          className="p-3 border hover:shadow-lg transition-all bg-white cursor-pointer"
                          style={{ borderColor: color, backgroundColor: `${color}10` }}
                          onClick={() => handleTipoClick(detalle)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span 
                                  className="w-2 h-2 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: color }} 
                                />
                                <h5 className="font-semibold text-gray-900 text-xs leading-tight truncate">{detalle.tipo}</h5>
                              </div>
                              <span className="text-xs font-bold text-gray-600 flex-shrink-0">{percentage}%</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {hasSolesData && detalle.soles !== undefined ? (
                                <div className="flex items-baseline justify-between gap-3 max-w-[220px] w-full mx-auto">
                                  <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                                    S/ {detalle.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </span>
                                  {detalle.cantidad !== undefined && (
                                    <span className="text-xs text-gray-500">
                                      {detalle.cantidad.toLocaleString('es-PE')} unidades
                                    </span>
                                  )}
                                </div>
                              ) : (
                                detalle.cantidad !== undefined && (
                                  <div className="flex items-baseline justify-between gap-3 max-w-[220px] w-full mx-auto">
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-lg font-bold text-blue-600">
                                        {detalle.cantidad.toLocaleString('es-PE')}
                                      </span>
                                      <span className="text-xs text-gray-500">unidades</span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                        </div>
                      </Card>
                    )})
                  })()}
                </div>
            </div>

            {/* Gráfico de Torta */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 justify-center">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                <span>Distribución de Recaudación</span>
              </h4>
              <PieChart
                detalles={displayedDetalles}
                metrica={currentMetrica}
                showLegend={true}
              />
            </div>

            {/* Sección Recaudado Hasta la Fecha - solo para Tránsito y Movilidad Urbana */}
            {subgerencia === "Subgerencia de Tránsito y Movilidad Urbana" && (
              <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  <span>Recaudado Hasta la Fecha</span>
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="overflow-x-auto">
                    <h5 className="text-xs font-semibold text-red-600 mb-2">Total de recaudación por mes</h5>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                          <th className="text-center py-2 px-2 font-semibold text-red-600">Licencia B-IIB</th>
                          <th className="text-center py-2 px-2 font-semibold text-red-600">Licencia B-IIC</th>
                          <th className="text-right py-2 px-2 font-semibold text-gray-700">Recaudado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { mes: "Enero", monto: 59647.86 },
                          { mes: "Febrero", monto: 35047.60 },
                          { mes: "Marzo", monto: 28620.30 },
                          { mes: "Abril", monto: 20058.10 },
                          { mes: "Mayo", monto: 43409.98 },
                          { mes: "Junio", monto: 22716.30 },
                          { mes: "Julio", monto: 18701.70 },
                          { mes: "Agosto", monto: 23996.00 },
                          { mes: "Septiembre", monto: 107.00 }
                        ].map((item, idx) => {
                          const biib = item.monto * 0.65
                          const biic = item.monto - biib
                          return (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                              <td className="py-2 px-2 text-center text-gray-700">S/. {biib.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-center text-gray-700">S/. {biic.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-right font-medium text-gray-900">S/. {item.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="overflow-x-auto">
                    <h5 className="text-xs font-semibold text-red-600 mb-2">Total de Trámites por mes</h5>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                          <th className="text-center py-2 px-2 font-semibold text-red-600">Licencia B-IIB</th>
                          <th className="text-center py-2 px-2 font-semibold text-red-600">Licencia B-IIC</th>
                          <th className="text-right py-2 px-2 font-semibold text-gray-700">Total de Trámites</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { mes: "Enero", monto: 59647.86 },
                          { mes: "Febrero", monto: 35047.60 },
                          { mes: "Marzo", monto: 28620.30 },
                          { mes: "Abril", monto: 20058.10 },
                          { mes: "Mayo", monto: 43409.98 },
                          { mes: "Junio", monto: 22716.30 },
                          { mes: "Julio", monto: 18701.70 },
                          { mes: "Agosto", monto: 23996.00 },
                          { mes: "Septiembre", monto: 107.00 }
                        ].map((item, idx) => {
                          const biib = Math.round((item.monto / 1000) * 6)
                          const biic = Math.round((item.monto / 1000) * 4)
                          const total = biib + biic
                          return (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                              <td className="py-2 px-2 text-center text-gray-700">{biib.toLocaleString('es-PE')}</td>
                              <td className="py-2 px-2 text-center text-gray-700">{biic.toLocaleString('es-PE')}</td>
                              <td className="py-2 px-2 text-right font-medium text-gray-900">{total.toLocaleString('es-PE')}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sección Reprogramaciones - solo para Tránsito y Movilidad Urbana */}
            {subgerencia === "Subgerencia de Tránsito y Movilidad Urbana" && false && (
              <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  <span>Reprogramaciones</span>
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="overflow-x-auto">
                    <h5 className="text-xs font-semibold text-red-600 mb-2">Total de reprogramaciones por mes</h5>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                          <th className="text-center py-2 px-2 font-semibold text-red-600">Licencia B-IIB</th>
                          <th className="text-center py-2 px-2 font-semibold text-red-600">Licencia B-IIC</th>
                          <th className="text-right py-2 px-2 font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { mes: "Enero", cantidad: 45 },
                          { mes: "Febrero", cantidad: 32 },
                          { mes: "Marzo", cantidad: 28 },
                          { mes: "Abril", cantidad: 18 },
                          { mes: "Mayo", cantidad: 38 },
                          { mes: "Junio", cantidad: 22 },
                          { mes: "Julio", cantidad: 15 },
                          { mes: "Agosto", cantidad: 25 },
                          { mes: "Septiembre", cantidad: 5 }
                        ].map((item, idx) => {
                          const biib = Math.round(item.cantidad * 0.6)
                          const biic = item.cantidad - biib
                          return (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                              <td className="py-2 px-2 text-center text-gray-700">{biib.toLocaleString('es-PE')}</td>
                              <td className="py-2 px-2 text-center text-gray-700">{biic.toLocaleString('es-PE')}</td>
                              <td className="py-2 px-2 text-right font-medium text-gray-900">{item.cantidad.toLocaleString('es-PE')}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="overflow-x-auto">
                    <h5 className="text-xs font-semibold text-red-600 mb-2">Motivos de reprogramación</h5>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Motivo</th>
                          <th className="text-center py-2 px-2 font-semibold text-red-600">Cantidad</th>
                          <th className="text-right py-2 px-2 font-semibold text-gray-700">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { motivo: "Documentación incompleta", cantidad: 85 },
                          { motivo: "Examen médico vencido", cantidad: 62 },
                          { motivo: "Falta de pago", cantidad: 45 },
                          { motivo: "Error en datos personales", cantidad: 28 },
                          { motivo: "Otros", cantidad: 8 }
                        ].map((item, idx) => {
                          const totalMotivos = 228
                          const porcentaje = ((item.cantidad / totalMotivos) * 100).toFixed(1)
                          return (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-2 text-gray-700">{item.motivo}</td>
                              <td className="py-2 px-2 text-center text-gray-700">{item.cantidad.toLocaleString('es-PE')}</td>
                              <td className="py-2 px-2 text-right font-medium text-gray-900">{porcentaje}%</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      </Dialog>

    {/* Modal de Nivel 3 */}
    {selectedTipo && (
      <TipoDetailModal
        isOpen={showNivel3}
        onClose={() => setShowNivel3(false)}
        subgerencia={subgerencia}
        tipo={selectedTipo.tipo}
        year={year}
        metrica={currentMetrica}
        estado={estado}
        subtipos={selectedTipo.subtipos || []}
        totalSoles={selectedTipo.soles}
        totalCantidad={selectedTipo.cantidad}
        taxisOriginalData={selectedTipo.tipo === "Taxis" ? detalles.filter(d => d.tipo.toLowerCase().includes("taxi")) : undefined}
      />
    )}
    </>
  )
}
