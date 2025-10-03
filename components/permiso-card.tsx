"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { TrendingUp, Calendar, Filter, Hash, BarChart2 } from "lucide-react"

interface PermisoCardProps {
  id: string
  title: string
  chartData: {
    enero: number
    febrero: number
    marzo: number
    abril: number
    mayo: number
    junio: number
    julio: number
    agosto: number
    septiembre: number
    octubre: number
    noviembre: number
    diciembre: number
  }
}

export function PermisoCard({ id, title, chartData }: PermisoCardProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedPeriod, setSelectedPeriod] = useState("Mensual")

  // Calcular total
  const total = Object.values(chartData).reduce((sum, val) => sum + val, 0)
  
  // Datos para el gráfico de barras
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const values = Object.values(chartData)
  const maxValue = Math.max(...values)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-blue-500 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
          <div className="flex flex-col items-center justify-center text-center min-h-[120px]">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">{title}</h3>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">{id}</span>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  PERMISOS
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Selectores con mejor diseño */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-green-600" />
                  Periodo
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-white border-green-200 hover:border-green-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Año
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-white border-green-200 hover:border-green-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Total destacado */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Acumulado</p>
                <p className="text-3xl font-bold">{total.toLocaleString('es-PE')}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Hash className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-green-600" />
              Evolución Mensual
            </h4>
            <div className="space-y-3">
              {months.map((month, index) => {
                const value = values[index]
                const percentage = (value / maxValue) * 100
                return (
                  <div key={month} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{month}</span>
                      <span className="font-bold text-gray-900">{value.toLocaleString('es-PE')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Estadísticas del Periodo</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Promedio Mensual</p>
                <p className="text-xl font-bold text-gray-900">{Math.round(total / 12).toLocaleString('es-PE')}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Mes con Mayor Registro</p>
                <p className="text-xl font-bold text-gray-900">{months[values.indexOf(maxValue)]}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Valor Máximo</p>
                <p className="text-xl font-bold text-gray-900">{maxValue.toLocaleString('es-PE')}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
