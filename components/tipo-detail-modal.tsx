"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { TrendingUp, ArrowLeft } from "lucide-react"

interface SubtipoDetalle {
  subtipo: string
  soles?: number
  cantidad?: number
}

interface TipoDetailModalProps {
  isOpen: boolean
  onClose: () => void
  subgerencia: string
  tipo: string
  year: string
  metrica: "soles" | "cantidad"
  estado: string
  subtipos: SubtipoDetalle[]
  totalSoles?: number
  totalCantidad?: number
}

// Colores para el gráfico de torta
const CHART_COLORS = [
  '#3b82f6', '#f97316', '#10b981', '#6366f1', '#38bdf8', '#f59e0a',
  '#06b6d4', '#4f46e5', '#14b8a6', '#0ea5e9', '#84cc16', '#1d4ed8'
]

// Componente de gráfico de torta para Nivel 3
function SubtipoPieChart({ subtipos, metrica }: { subtipos: SubtipoDetalle[], metrica: "soles" | "cantidad" }) {
  const values = subtipos.map((subtipo) =>
    metrica === "soles" ? (subtipo.soles || 0) : (subtipo.cantidad || 0)
  )

  const total = values.reduce((sum, value) => sum + value, 0)

  if (total === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No hay datos disponibles
      </div>
    )
  }

  // Calcular porcentajes con normalización para que la suma redondeada sea exactamente 100%
  const rawPercentages = values.map((value) => (value / total) * 100)
  const roundedPercentages = rawPercentages.map((p) => Number(p.toFixed(1)))
  const roundedSum = roundedPercentages.reduce((sum, p) => sum + p, 0)
  const diff = Number((100 - roundedSum).toFixed(1))

  if (Math.abs(diff) > 0 && roundedPercentages.length > 0) {
    // Ajustar el último segmento no nulo para corregir el desajuste de redondeo
    const lastIndex = [...roundedPercentages]
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p > 0)
      .map(({ i }) => i)
      .pop()

    if (lastIndex !== undefined) {
      roundedPercentages[lastIndex] = Number(
        (roundedPercentages[lastIndex] + diff).toFixed(1)
      )
    }
  }

  let currentAngle = 0
  const segments = subtipos.map((subtipo, index) => {
    const value = values[index]
    const percentage = roundedPercentages[index] ?? 0
    const angle = (percentage / 100) * 360
    const segment = {
      subtipo,
      value,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }
    currentAngle += angle
    return segment
  })

  const gradientStops = segments.map((seg) => {
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
                <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{seg.subtipo.subtipo}</p>
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

export function TipoDetailModal({
  isOpen,
  onClose,
  subgerencia,
  tipo,
  year,
  estado,
  subtipos,
  totalSoles,
  totalCantidad
}: TipoDetailModalProps) {
  // Check if soles data is available
  const hasSolesData = totalSoles !== undefined && totalSoles > 0
  const currentMetrica: "soles" | "cantidad" = hasSolesData ? "soles" : "cantidad"
  const [filterYear, setFilterYear] = useState(year)
  const [filterPeriodos, setFilterPeriodos] = useState<string[]>(["Todos"])
  const [isPeriodoOpen, setIsPeriodoOpen] = useState(false)

  const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")

  const shouldAddReprogramacion = normalize(tipo).includes("licencia conducir clase b-iic")

  const baseSolesTotal = subtipos.reduce((acc, s) => acc + (s.soles ?? 0), 0)
  const baseCantidadTotal = subtipos.reduce((acc, s) => acc + (s.cantidad ?? 0), 0)

  const displayedSubtipos: SubtipoDetalle[] = (() => {
    if (!shouldAddReprogramacion) return subtipos

    const hasRepro = subtipos.some((s) => normalize(s.subtipo).includes("reprogram"))
    if (hasRepro) return subtipos

    const missingSoles = Math.max(0, (totalSoles ?? 0) - baseSolesTotal)
    const missingCantidad = Math.max(0, (totalCantidad ?? 0) - baseCantidadTotal)

    return [...subtipos, { subtipo: "Reprogramación", soles: missingSoles, cantidad: missingCantidad }]
  })()

  const monthlyBaseData = [
    { mes: "Enero", monto: 59647.86, cantidad: 1000 },
    { mes: "Febrero", monto: 35047.60, cantidad: 850 },
    { mes: "Marzo", monto: 28620.30, cantidad: 780 },
    { mes: "Abril", monto: 20058.10, cantidad: 620 },
    { mes: "Mayo", monto: 43409.98, cantidad: 910 },
    { mes: "Junio", monto: 22716.30, cantidad: 700 },
    { mes: "Julio", monto: 18701.70, cantidad: 640 },
    { mes: "Agosto", monto: 23996.00, cantidad: 730 },
    { mes: "Septiembre", monto: 107.00, cantidad: 10 },
  ]

  const subtipoSolesTotal = displayedSubtipos.reduce((acc, s) => acc + (s.soles ?? 0), 0)
  const subtipoCantidadTotal = displayedSubtipos.reduce((acc, s) => acc + (s.cantidad ?? 0), 0)

  const monthlyRecaudacionRows = monthlyBaseData.map((row) => {
    const perSubtipo = displayedSubtipos.map((s) => {
      const weight = subtipoSolesTotal ? (s.soles ?? 0) / subtipoSolesTotal : 0
      return row.monto * weight
    })
    return { ...row, perSubtipo }
  })

  const monthlyCantidadRows = monthlyBaseData.map((row) => {
    const perSubtipo = displayedSubtipos.map((s) => {
      const weight = subtipoCantidadTotal ? (s.cantidad ?? 0) / subtipoCantidadTotal : 0
      return Math.round(row.cantidad * weight)
    })
    const total = perSubtipo.reduce((a, b) => a + b, 0)
    return { ...row, perSubtipo, total }
  })

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
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="!max-w-[100vw] !w-[100vw] md:!max-w-[95vw] md:!w-[95vw] xl:!max-w-[85vw] xl:!w-[85vw] 2xl:!max-w-[75vw] 2xl:!w-[75vw] !max-h-[90vh] p-0 flex flex-col"
        style={{ maxWidth: '100vw', width: '100vw' }}
      >
        <DialogHeader className="border-b pb-4 px-3 md:px-4 lg:px-6 pt-3 md:pt-4 lg:pt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Atrás</span>
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                  NIVEL 3 - SUBTIPOS
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {year}
                </span>
                <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {estado}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {subgerencia} → {tipo}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Contenido principal en layout horizontal */}
        <div className="overflow-y-auto px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6">
          {/* Total destacado - compacto */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg text-white shadow-lg mb-4">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-10 flex-wrap">
                {hasSolesData ? (
                  <>
                    <div>
                      <p className="text-purple-100 text-xs font-medium mb-1">Total Recaudación</p>
                      <p className="text-2xl font-bold whitespace-nowrap">
                        S/ {(totalSoles || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-purple-100 text-xs font-medium mb-1">Total de Trámites</p>
                      <p className="text-2xl font-bold whitespace-nowrap">
                        {(totalCantidad || 0).toLocaleString('es-PE')}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-purple-100 text-xs font-medium mb-1">Total de Trámites</p>
                    <p className="text-2xl font-bold whitespace-nowrap">
                      {(totalCantidad || 0).toLocaleString('es-PE')}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Año:</span>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="border border-white/40 bg-white/10 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y} className="text-gray-900">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-start gap-1 relative">
                  <span className="font-semibold mt-1">Meses/Periodo:</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPeriodoOpen((prev) => !prev)}
                      className="flex items-center gap-1 border border-white/40 bg-white/10 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70 min-w-[140px] justify-between"
                    >
                      <span className="truncate text-left">
                        {selectedPeriodSummary}
                      </span>
                      <span className="text-[10px]">▼</span>
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
                                          return ["Todos", ...monthValues]
                                        }
                                        return [...prev.filter((v) => v !== "Todos"), p.value]
                                      }

                                      if (p.value === "Todos") {
                                        return []
                                      }

                                      const next = prev.filter((v) => v !== p.value)
                                      const remainingMonths = next.filter((v) => v !== "Todos")
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

          {/* Layout vertical para móvil */}
          <div className="flex flex-col gap-4">
            {/* Detalles por subtipo - grid compacto */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                <span>Detalle por Subtipo</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {displayedSubtipos.map((subtipo, index) => {
                  const color = CHART_COLORS[index % CHART_COLORS.length]
                  return (
                    <Card
                      key={index}
                      className="p-3 border hover:shadow-md transition-all bg-white"
                      style={{ borderColor: color, backgroundColor: `${color}15` }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <h5 className="font-semibold text-gray-900 text-xs leading-tight truncate">
                            {subtipo.subtipo}
                          </h5>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {currentMetrica === "cantidad" ? (
                            // Cantidad como métrica principal: cantidad + unidades a la izquierda, soles a la derecha, centrado en el card
                            <div className="flex items-baseline justify-between gap-3 max-w-[220px] w-full mx-auto">
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-purple-600">
                                  {(subtipo.cantidad || 0).toLocaleString('es-PE')}
                                </span>
                                <span className="text-xs text-gray-500">unidades</span>
                              </div>
                              {subtipo.soles !== undefined && (
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  S/ {subtipo.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </span>
                              )}
                            </div>
                          ) : (
                            // Soles como métrica principal: soles a la izquierda, cantidad a la derecha, misma separación
                            <>
                              {subtipo.soles !== undefined && (
                                <div className="flex items-baseline justify-between gap-3 max-w-[220px] w-full mx-auto">
                                  <span className="text-lg font-bold text-purple-600 whitespace-nowrap">
                                    S/ {subtipo.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </span>
                                  {subtipo.cantidad !== undefined && (
                                    <span className="text-lg font-bold text-purple-600 whitespace-nowrap">
                                      {subtipo.cantidad.toLocaleString('es-PE')} unidades
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Gráfico de Torta */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 justify-center">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                <span>Distribución por Subtipo</span>
              </h4>
              <SubtipoPieChart subtipos={displayedSubtipos} metrica={currentMetrica} />
            </div>

            {/* Tablas por mes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <h4 className="text-xs md:text-sm font-semibold text-red-600 mb-3">
                  Total de recaudación por mes
                </h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                      {displayedSubtipos.map((s) => (
                        <th
                          key={s.subtipo}
                          className="text-center py-2 px-2 font-semibold text-red-600"
                          title={s.subtipo}
                        >
                          {s.subtipo}
                        </th>
                      ))}
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Recaudado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRecaudacionRows.map((row) => (
                      <tr key={row.mes} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 text-gray-700">{row.mes}</td>
                        {row.perSubtipo.map((value, idx) => (
                          <td key={idx} className="py-2 px-2 text-center text-gray-700 whitespace-nowrap">
                            S/. {value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </td>
                        ))}
                        <td className="py-2 px-2 text-right font-medium text-gray-900 whitespace-nowrap">
                          S/. {row.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <h4 className="text-xs md:text-sm font-semibold text-red-600 mb-3">
                  Total de Trámites por mes
                </h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                      {displayedSubtipos.map((s) => (
                        <th
                          key={s.subtipo}
                          className="text-center py-2 px-2 font-semibold text-red-600"
                          title={s.subtipo}
                        >
                          {s.subtipo}
                        </th>
                      ))}
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyCantidadRows.map((row) => (
                      <tr key={row.mes} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 text-gray-700">{row.mes}</td>
                        {row.perSubtipo.map((value, idx) => (
                          <td key={idx} className="py-2 px-2 text-center text-gray-700 whitespace-nowrap">
                            {value.toLocaleString('es-PE')}
                          </td>
                        ))}
                        <td className="py-2 px-2 text-right font-medium text-gray-900 whitespace-nowrap">
                          {row.total.toLocaleString('es-PE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
