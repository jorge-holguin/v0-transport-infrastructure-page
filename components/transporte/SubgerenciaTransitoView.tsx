"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CreditCard, ArrowLeft, Users, Building, TrendingUp } from "lucide-react"
import { SubgerenciaCard } from "@/components/subgerencia-card"
import { transitoDetalles, senalizacionMensualData, senalTiposConfig, periodoOptions, getYearOptions, getSelectedPeriodSummary } from "./data"
import { ManualUsoPDF } from "@/components/shared/ManualUsoPDF"

interface SubgerenciaTransitoViewProps {
  onBack: () => void
  selectedYear: string
  viewType: "recaudacion" | "senalizacion"
}

export function SubgerenciaTransitoView({ onBack, selectedYear, viewType }: SubgerenciaTransitoViewProps) {
  const [senalFilterYear, setSenalFilterYear] = useState(selectedYear)
  const [senalFilterPeriodos, setSenalFilterPeriodos] = useState<string[]>(["Todos"])
  const [isSenalPeriodoOpen, setIsSenalPeriodoOpen] = useState(false)

  const senalYearOptions = getYearOptions(parseInt(selectedYear, 10))
  const senalSelectedPeriodSummary = getSelectedPeriodSummary(senalFilterPeriodos)

  // Filtrar datos de señalización por período
  const filteredSenalizacionMensualData = senalizacionMensualData.filter((item) => {
    if (senalFilterPeriodos.length === 0 || senalFilterPeriodos.includes("Todos")) return true
    return senalFilterPeriodos.includes(item.mes)
  })

  const totalM2Senalizacion = filteredSenalizacionMensualData.reduce((acc, item) => acc + item.m2, 0)

  // Distribuir por tipo
  const distributedSenalTipos = (() => {
    const base = senalTiposConfig.map((t) => Math.floor(totalM2Senalizacion * t.weight))
    const baseSum = base.reduce((acc, v) => acc + v, 0)
    let remaining = Math.max(0, totalM2Senalizacion - baseSum)
    const next = [...base]
    let i = 0
    while (remaining > 0 && next.length > 0) {
      next[i % next.length] += 1
      remaining -= 1
      i += 1
    }
    return next
  })()

  const senalizacionTiposData = senalTiposConfig.map((t, idx) => ({
    tipo: t.tipo,
    m2: distributedSenalTipos[idx] || 0
  }))

  // Calcular totales de recaudación
  const totalSoles = transitoDetalles.reduce((sum, d) => sum + d.soles, 0)
  const totalCantidad = transitoDetalles.reduce((sum, d) => sum + d.cantidad, 0)

  if (viewType === "recaudacion") {
    return (
      <div className="space-y-6">
        <Card className="bg-white/95 backdrop-blur-sm p-8">
          {/* Botón Atrás en recuadro blanco */}
          <div className="mb-4 flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Atrás
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SubgerenciaCard
              nombre="Subgerencia de Tránsito y Movilidad Urbana"
              titulo="Monto recaudado por Subgerencia de Tránsito y Movilidad Urbana"
              year={selectedYear}
              metrica="soles"
              estado="Todos"
              totalSoles={totalSoles}
              totalCantidad={totalCantidad}
              metaSoles={550000}
              metaCantidad={5200}
              showDonut={true}
              icon={<Users className="w-6 h-6" />}
              detalles={transitoDetalles}
            />
          </div>
        </Card>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Señalización
  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm p-8 space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="mb-4 flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Building className="w-8 h-8 text-orange-600" />
                Subgerencia de Tránsito y Movilidad Urbana → Señales Horizontales de vías
              </h3>
              <p className="text-lg text-gray-600 font-semibold">M2 de señalización horizontal</p>
            </div>

            {/* Total m2 destacado */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-lg text-white shadow-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs font-medium mb-1">Total intervenido</p>
                  <p className="text-2xl font-bold">{totalM2Senalizacion.toLocaleString("es-PE")} m²</p>
                </div>
                <div className="flex flex-wrap items-center md:items-center justify-end gap-2 md:gap-3 text-[10px] md:text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Año:</span>
                    <select
                      value={senalFilterYear}
                      onChange={(e) => setSenalFilterYear(e.target.value)}
                      className="border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70"
                    >
                      {senalYearOptions.map((y) => (
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
                        onClick={() => setIsSenalPeriodoOpen((prev) => !prev)}
                        className="flex items-center gap-1 border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70 min-w-[140px] justify-between"
                      >
                        <span className="truncate text-left">
                          {senalSelectedPeriodSummary}
                        </span>
                        <span className="text-[9px]">▼</span>
                      </button>
                      {isSenalPeriodoOpen && (
                        <div className="absolute right-0 mt-1 max-h-56 w-56 overflow-auto rounded-md bg-white text-gray-900 shadow-lg border border-gray-200 z-20">
                          <div className="p-2 text-[11px] font-semibold text-gray-700 border-b border-gray-100">
                            Selecciona meses / periodos
                          </div>
                          <div className="p-2 flex flex-col gap-1 text-xs">
                            {periodoOptions.map((p) => {
                              const checked = senalFilterPeriodos.includes(p.value)
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
                                      setSenalFilterPeriodos((prev) => {
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Registro de Mantenimiento de Señalización Horizontal por tipo */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  Registro de Mantenimiento de Señalización Horizontal por tipo
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {senalizacionTiposData.map((item) => (
                    <div key={item.tipo} className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{item.m2.toLocaleString('es-PE')} m²</p>
                        <p className="text-sm text-orange-700 font-medium">{item.tipo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registro de Mantenimiento de Señalización Horizontal por Mes */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  Registro de Mantenimiento de Señalización Horizontal por Mes
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                        <th className="text-right py-2 px-2 font-semibold text-gray-700">M2 intervenidos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSenalizacionMensualData.map((item) => (
                        <tr key={item.mes} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                          <td className="py-2 px-2 text-right font-medium text-gray-900">{item.m2.toLocaleString('es-PE')} m²</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
      </Card>

      <ManualUsoPDF />
    </div>
  )
}
