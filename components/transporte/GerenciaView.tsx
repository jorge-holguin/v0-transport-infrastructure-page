"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CreditCard, TrendingUp, PieChart as PieChartIcon, ArrowLeft } from "lucide-react"
import { RecaudacionFilters } from "@/components/recaudacion-filters"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { subgerenciasData } from "./data"
import { ManualUsoPDF } from "@/components/shared/ManualUsoPDF"

interface GerenciaViewProps {
  onBack: () => void
  selectedYear: string
  onYearChange: (year: string) => void
}

export function GerenciaView({ onBack, selectedYear, onYearChange }: GerenciaViewProps) {
  const [selectedEstado, setSelectedEstado] = useState("Todos")
  const [selectedMetrica, setSelectedMetrica] = useState<"soles" | "cantidad">("soles")
  const [selectedSubgerencias, setSelectedSubgerencias] = useState<string[]>([
    "Subgerencia de Transportes",
    "Subgerencia de Fiscalización",
    "Subgerencia de Tránsito y Movilidad Urbana"
  ])
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["Todos"])

  // Totales
  const totalAvance = subgerenciasData.reduce((sum, sub) => sum + sub.soles, 0)
  const totalMeta = subgerenciasData.reduce((sum, sub) => sum + sub.metaSoles, 0)

  const pieData = [
    { name: "Recaudado", value: totalAvance },
    { name: "Por Recaudar", value: Math.max(totalMeta - totalAvance, 0) }
  ]

  // Datos mensuales
  const monthlyBaseData = [
    { mes: "Enero", proporcion: 0.095 },
    { mes: "Febrero", proporcion: 0.098 },
    { mes: "Marzo", proporcion: 0.100 },
    { mes: "Abril", proporcion: 0.097 },
    { mes: "Mayo", proporcion: 0.095 },
    { mes: "Junio", proporcion: 0.092 },
    { mes: "Julio", proporcion: 0.090 },
    { mes: "Agosto", proporcion: 0.088 },
    { mes: "Septiembre", proporcion: 0.086 },
    { mes: "Octubre", proporcion: 0.084 },
    { mes: "Noviembre", proporcion: 0.075 },
    { mes: "Diciembre", proporcion: 0.0 }
  ]

  const distributeByProportion = (total: number, base: { mes: string; proporcion: number }[]) => {
    const totalCents = Math.round(total * 100)
    const cents = base.map((b) => Math.floor(totalCents * b.proporcion))
    const baseSum = cents.reduce((acc, v) => acc + v, 0)
    let remaining = Math.max(0, totalCents - baseSum)
    let i = 0
    while (remaining > 0 && cents.length > 0) {
      cents[i % cents.length] += 1
      remaining -= 1
      i += 1
    }
    return cents
  }

  const totalPendiente = Math.max(totalMeta - totalAvance, 0)
  const recaudadoCentsByMonth = distributeByProportion(totalAvance, monthlyBaseData)
  const pendienteCentsByMonth = distributeByProportion(totalPendiente, monthlyBaseData)

  const monthlyData = (() => {
    let acumuladoPendienteCents = 0
    return monthlyBaseData.map((item, idx) => {
      const recaudadoCents = recaudadoCentsByMonth[idx] || 0
      const pendienteCents = pendienteCentsByMonth[idx] || 0
      acumuladoPendienteCents += pendienteCents
      const totalProyectadoCents = recaudadoCents + pendienteCents
      return {
        mes: item.mes,
        recaudado: recaudadoCents / 100,
        porRecaudar: pendienteCents / 100,
        acumuladoPendiente: acumuladoPendienteCents / 100,
        totalProyectado: totalProyectadoCents / 100
      }
    })
  })()

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm p-8">
        {/* Botón Atrás en recuadro blanco */}
        <div className="mb-4 flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-1">
                <CreditCard className="w-8 h-8 text-blue-600" />
                Indicadores de la Gerencia de Transportes
              </h3>
              <p className="text-lg text-gray-600 ml-11">Recaudación</p>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Recaudación Total por la Gerencia de Transporte y Movilidad Urbana
            </h4>
            
            {/* Total destacado */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg shadow-lg mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 rounded-lg px-4 py-2">
                    <p className="text-white text-xs font-medium mb-0.5">Monto Recaudado</p>
                    <p className="text-xl font-bold text-white whitespace-nowrap">
                      S/ {totalAvance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-red-500 rounded-lg px-4 py-2">
                    <p className="text-white text-xs font-medium mb-0.5">Monto Pendiente de Recaudación</p>
                    <p className="text-xl font-bold text-white whitespace-nowrap">
                      S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-white text-xs font-medium mb-0.5">Recaudación Total Proyectada</p>
                    <p className="text-xl font-bold text-white whitespace-nowrap">
                      S/ {totalMeta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-emerald-500 rounded-lg px-4 py-2">
                    <p className="text-white text-xs font-medium mb-0.5">Cumplimiento</p>
                    <p className="text-xl font-bold text-white whitespace-nowrap">
                      {(totalMeta > 0 ? ((totalAvance / totalMeta) * 100) : 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white text-xs">
                  <RecaudacionFilters
                    selectedYear={selectedYear}
                    onYearChange={onYearChange}
                    selectedEstado={selectedEstado}
                    onEstadoChange={setSelectedEstado}
                    selectedMetrica={selectedMetrica}
                    onMetricaChange={setSelectedMetrica}
                    selectedSubgerencias={selectedSubgerencias}
                    onSubgerenciasChange={setSelectedSubgerencias}
                    availableSubgerencias={[
                      "Subgerencia de Transportes",
                      "Subgerencia de Fiscalización",
                      "Subgerencia de Tránsito y Movilidad Urbana"
                    ]}
                    selectedMonths={selectedMonths}
                    onMonthsChange={setSelectedMonths}
                    variant="inline"
                  />
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfico de Torta */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h5 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-blue-600" />
                  Recaudado vs Por Recaudar
                </h5>
                <div className="flex items-center gap-6">
                  <div className="w-48 h-48">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          labelLine={false}
                        >
                          <Cell fill="#16a34a" />
                          <Cell fill="#ef4444" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Recaudado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">Por Recaudar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de Barras */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h5 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Recaudación por Mes (Porcentajes)
                </h5>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={70} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value) => `S/ ${(value as number).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="recaudado" stackId="a" fill="#16a34a" name="Recaudado" />
                      <Bar dataKey="porRecaudar" stackId="a" fill="#ef4444" name="Por Recaudar" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-700 mb-4">Recaudación Mensual por la Gerencia de Transporte y Movilidad Urbana</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Mes</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Monto Recaudado</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Monto Pendiente de Recaudación</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Monto Acumulado Pendiente de Recaudación</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Recaudación Total Proyectada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">{item.mes}</td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">
                          S/ {item.recaudado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-red-600">
                          S/ {item.porRecaudar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
                          S/ {item.acumuladoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-sky-700">
                          S/ {item.totalProyectado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td className="py-3 px-4 text-gray-900">TOTAL</td>
                      <td className="py-3 px-4 text-right text-green-600">
                        S/ {totalAvance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right text-red-600">
                        S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right text-sky-700">
                        S/ {totalMeta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
      </Card>

      <ManualUsoPDF />
    </div>
  )
}
