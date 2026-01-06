"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { GraduationCap, ArrowLeft, TrendingUp } from "lucide-react"
import { capacitacionMensualBaseData, capacitacionTemasConfig, periodoOptions, getYearOptions, getSelectedPeriodSummary } from "./data"
import { ManualUsoPDF } from "@/components/shared/ManualUsoPDF"

interface SubgerenciaEducacionViewProps {
  onBack: () => void
  selectedYear: string
}

export function SubgerenciaEducacionView({ onBack, selectedYear }: SubgerenciaEducacionViewProps) {
  const [capFilterYear, setCapFilterYear] = useState(selectedYear)
  const [capFilterPeriodos, setCapFilterPeriodos] = useState<string[]>(["Todos"])
  const [isCapPeriodoOpen, setIsCapPeriodoOpen] = useState(false)

  const capYearOptions = getYearOptions(parseInt(selectedYear, 10))
  const capSelectedPeriodSummary = getSelectedPeriodSummary(capFilterPeriodos)

  // Agregar choferes totales a los datos mensuales
  const capacitacionMensualData = capacitacionMensualBaseData.map((item) => ({
    ...item,
    choferes: item.vm + item.taxis + item.tu
  }))

  // Filtrar por período
  const filteredCapacitacionMensualData = capacitacionMensualData.filter((item) => {
    if (capFilterPeriodos.length === 0 || capFilterPeriodos.includes("Todos")) return true
    return capFilterPeriodos.includes(item.mes)
  })

  const maxChoferesMensual = filteredCapacitacionMensualData.length
    ? Math.max(...filteredCapacitacionMensualData.map((i) => i.choferes))
    : 0

  const totalCapacitaciones = filteredCapacitacionMensualData.reduce((acc, item) => acc + item.choferes, 0)

  // Capacitación por modo de transporte
  const capacitacionPorModo = [
    {
      modo: "Vehículos menores",
      cantidad: filteredCapacitacionMensualData.reduce((acc, item) => acc + item.vm, 0)
    },
    {
      modo: "Servicio de Taxi",
      cantidad: filteredCapacitacionMensualData.reduce((acc, item) => acc + item.taxis, 0)
    },
    {
      modo: "Transporte urbano",
      cantidad: filteredCapacitacionMensualData.reduce((acc, item) => acc + item.tu, 0)
    }
  ]

  // Distribuir por temas
  const distributedCapTemas = (() => {
    const base = capacitacionTemasConfig.map((t) => Math.floor(totalCapacitaciones * t.weight))
    const baseSum = base.reduce((acc, v) => acc + v, 0)
    let remaining = Math.max(0, totalCapacitaciones - baseSum)
    const next = [...base]
    let i = 0
    while (remaining > 0 && next.length > 0) {
      next[i % next.length] += 1
      remaining -= 1
      i += 1
    }
    return next
  })()

  const capacitacionTemasData = capacitacionTemasConfig.map((t, idx) => ({
    tema: t.tema,
    choferes: distributedCapTemas[idx] || 0
  }))

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm p-8 space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="mb-4 flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
            
            {/* Banner total personas capacitadas */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg text-white shadow-lg mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">Total personas capacitadas</p>
                  <p className="text-2xl font-bold">
                    {totalCapacitaciones.toLocaleString('es-PE')} personas capacitadas
                  </p>
                </div>
                <div className="flex flex-wrap items-center md:items-center justify-end gap-2 md:gap-3 text-[10px] md:text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Año:</span>
                    <select
                      value={capFilterYear}
                      onChange={(e) => setCapFilterYear(e.target.value)}
                      className="border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70"
                    >
                      {capYearOptions.map((y) => (
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
                        onClick={() => setIsCapPeriodoOpen((prev) => !prev)}
                        className="flex items-center gap-1 border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70 min-w-[140px] justify-between"
                      >
                        <span className="truncate text-left">
                          {capSelectedPeriodSummary}
                        </span>
                        <span className="text-[9px]">▼</span>
                      </button>
                      {isCapPeriodoOpen && (
                        <div className="absolute right-0 mt-1 max-h-56 w-56 overflow-auto rounded-md bg-white text-gray-900 shadow-lg border border-gray-200 z-20">
                          <div className="p-2 text-[11px] font-semibold text-gray-700 border-b border-gray-100">
                            Selecciona meses / periodos
                          </div>
                          <div className="p-2 flex flex-col gap-1 text-xs">
                            {periodoOptions.map((p) => {
                              const checked = capFilterPeriodos.includes(p.value)
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
                                      setCapFilterPeriodos((prev) => {
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

            {/* Capacitaciones por temas */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Capacitaciones por temas
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {capacitacionTemasData.map((item) => (
                  <div key={item.tema} className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-center shadow-sm">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.choferes.toLocaleString('es-PE')} Personas capacitadas en
                    </p>
                    <p className="text-xs text-gray-700 mt-1">{item.tema}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs md:text-sm text-gray-700 font-semibold bg-green-50 border border-green-200 rounded-md px-3 py-2">
                Las capacitaciones del Programa de Seguridad Vial es obligatorio para obtener sus permisos de circulación
              </p>
            </div>

            {/* Capacitaciones por modo de transporte */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">Capacitaciones por modo de transporte</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {capacitacionPorModo.map((item) => (
                  <div key={item.modo} className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-center shadow-sm">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.cantidad.toLocaleString('es-PE')} choferes capacitados
                    </p>
                    <p className="text-xs text-gray-700 mt-1">en {item.modo.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total de Choferes capacitados por mes */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Total de choferes capacitados por mes
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {filteredCapacitacionMensualData.map((item) => (
                    <div key={item.mes} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 w-20">{item.mes}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all"
                          style={{ width: `${maxChoferesMensual ? (item.choferes / maxChoferesMensual) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                        <th className="text-right py-2 px-2 font-semibold text-gray-700">Vehículo Menores</th>
                        <th className="text-right py-2 px-2 font-semibold text-gray-700">Taxis</th>
                        <th className="text-right py-2 px-2 font-semibold text-gray-700">Transporte Urbano</th>
                        <th className="text-right py-2 px-2 font-semibold text-gray-700">Total de choferes capacitadas por mes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCapacitacionMensualData.map((item) => (
                        <tr key={item.mes} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                          <td className="py-2 px-2 text-right font-medium text-gray-900">{item.vm.toLocaleString('es-PE')}</td>
                          <td className="py-2 px-2 text-right font-medium text-gray-900">{item.taxis.toLocaleString('es-PE')}</td>
                          <td className="py-2 px-2 text-right font-medium text-gray-900">{item.tu.toLocaleString('es-PE')}</td>
                          <td className="py-2 px-2 text-right font-medium text-gray-900">{item.choferes.toLocaleString('es-PE')}</td>
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
