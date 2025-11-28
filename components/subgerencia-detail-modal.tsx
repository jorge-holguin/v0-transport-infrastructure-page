"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Hash, ArrowLeft, BarChart3 } from "lucide-react"
import { TipoDetailModal } from "./tipo-detail-modal"

interface SubtipoDetalle {
  subtipo: string
  soles?: number
  cantidad?: number
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
function PieChart({ detalles, metrica }: { detalles: DetalleNivel2[], metrica: "soles" | "cantidad" }) {
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
    </div>
  )
}

interface SubgerenciaDetailModalProps {
  isOpen: boolean
  onClose: () => void
  subgerencia: string
  year: string
  metrica: "soles" | "cantidad"
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
  const [currentMetrica, setCurrentMetrica] = useState<"soles" | "cantidad">(metrica)

  // Check if soles data is available
  const hasSolesData = totalSoles !== undefined && totalSoles > 0

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
    if (detalle.subtipos && detalle.subtipos.length > 0) {
      setSelectedTipo(detalle)
      setShowNivel3(true)
    }
  }

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
          
          {/* Toggle de Métrica - Only show if soles data is available */}
          {hasSolesData && (
            <div className="mt-4 flex justify-end">
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  onClick={() => setCurrentMetrica("soles")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    currentMetrica === "soles"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Soles (S/)
                </button>
                <button
                  onClick={() => setCurrentMetrica("cantidad")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    currentMetrica === "cantidad"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <Hash className="w-4 h-4 inline mr-1" />
                  Cantidad
                </button>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Contenido principal en layout horizontal */}
        <div className="overflow-y-auto px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6">
          {/* Total destacado - compacto */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 md:p-4 rounded-lg text-white shadow-lg mb-3 md:mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
              <div>
                <p className="text-blue-100 text-[10px] md:text-xs font-medium mb-1">
                  {currentMetrica === "soles" ? "Total Recaudación" : "Total Cantidad"}
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  {currentMetrica === "soles" 
                    ? `S/ ${(totalSoles || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                    : `${(totalCantidad || 0).toLocaleString('es-PE')} unidades`
                  }
                </p>
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
                  {detalles.map((detalle, index) => {
                    const color = CHART_COLORS[index % CHART_COLORS.length]
                    return (
                      <Card 
                        key={index} 
                        className={`p-3 border hover:shadow-md transition-all bg-white ${detalle.subtipos && detalle.subtipos.length > 0 ? 'cursor-pointer hover:shadow-lg' : ''}`}
                        style={{ borderColor: color, backgroundColor: `${color}10` }}
                        onClick={() => handleTipoClick(detalle)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2 h-2 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: color }} 
                            />
                            <h5 className="font-semibold text-gray-900 text-xs leading-tight truncate">{detalle.tipo}</h5>
                          </div>
                          <div className="flex flex-col gap-0.5">
                          {currentMetrica === "soles" && detalle.soles !== undefined && (
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold text-blue-600">
                                S/ {detalle.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </span>
                              {detalle.cantidad !== undefined && (
                                <span className="text-xs text-gray-500">
                                  {detalle.cantidad} unidades
                                </span>
                              )}
                            </div>
                          )}
                          {currentMetrica === "cantidad" && detalle.cantidad !== undefined && (
                            <div className="flex items-baseline gap-10">
                              <span className="text-lg font-bold text-blue-600">
                                {detalle.cantidad.toLocaleString('es-PE')}
                              </span>
                              <span className="text-xs text-gray-500">unidades</span>
                              {detalle.soles !== undefined && (
                                <span className="text-xs text-gray-500">
                                  S/ {detalle.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )})}
                </div>
            </div>

            {/* Gráfico de Torta */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 justify-center">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                <span>Distribución {currentMetrica === "soles" ? "de Recaudación" : "de Cantidad"}</span>
              </h4>
              <PieChart detalles={detalles} metrica={currentMetrica} />
            </div>

            {/* Sección Recaudado Hasta la Fecha - solo para Tránsito y Movilidad Urbana */}
            {subgerencia === "Subgerencia de Tránsito y Movilidad Urbana" && (
              <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                  <span>Recaudado Hasta la Fecha</span>
                </h4>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900 text-center">
                    Recaudado S/. 252,304.84
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Gráfico de Barras */}
                  <div className="space-y-2">
                    {[
                      { mes: "Enero", monto: 59647.86, max: 60000 },
                      { mes: "Febrero", monto: 35047.60, max: 60000 },
                      { mes: "Marzo", monto: 28620.30, max: 60000 },
                      { mes: "Abril", monto: 43409.98, max: 60000 },
                      { mes: "Mayo", monto: 20058.10, max: 60000 },
                      { mes: "Junio", monto: 22716.30, max: 60000 },
                      { mes: "Julio", monto: 18701.70, max: 60000 },
                      { mes: "Agosto", monto: 23996.00, max: 60000 },
                      { mes: "Septiembre", monto: 107.00, max: 60000 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 w-20">{item.mes}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${(item.monto / item.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tabla de Datos */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
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
                        ].map((item, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                            <td className="py-2 px-2 text-right font-medium text-gray-900">
                              S/. {item.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
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
        metrica={metrica}
        estado={estado}
        subtipos={selectedTipo.subtipos || []}
        totalSoles={selectedTipo.soles}
        totalCantidad={selectedTipo.cantidad}
      />
    )}
    </>
  )
}
