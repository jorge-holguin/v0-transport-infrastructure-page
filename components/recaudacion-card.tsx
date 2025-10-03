"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { TrendingUp, Calendar, Filter, DollarSign, X } from "lucide-react"

interface RecaudacionCardProps {
  id: string
  title: string
  chartData: {
    intervenciones: number
    licencias: number
    autorizaciones: number
  }
}

export function RecaudacionCard({ id, title, chartData }: RecaudacionCardProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedType, setSelectedType] = useState("Neto")

  const total = chartData.intervenciones + chartData.licencias + chartData.autorizaciones
  
  // Calcular porcentajes para el gráfico circular
  const intervencionesPercent = (chartData.intervenciones / total) * 100
  const licenciasPercent = (chartData.licencias / total) * 100
  const autorizacionesPercent = (chartData.autorizaciones / total) * 100

  // Calcular ángulos para el gráfico SVG
  const intervencionesAngle = (intervencionesPercent / 100) * 360
  const licenciasAngle = (licenciasPercent / 100) * 360
  const autorizacionesAngle = (autorizacionesPercent / 100) * 360

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-blue-500 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
          <div className="flex flex-col items-center justify-center text-center min-h-[120px]">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">{title}</h3>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">{id}</span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  RECAUDACIÓN
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Tipo
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white border-blue-200 hover:border-blue-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Neto">Neto</SelectItem>
                    <SelectItem value="Bruto">Bruto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Año
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-white border-blue-200 hover:border-blue-400 transition-colors">
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Recaudado</p>
                <p className="text-3xl font-bold">S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Gráfico Circular mejorado */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Distribución de Recaudación
            </h4>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-72 h-72">
                <div 
                  className="w-full h-full rounded-full shadow-xl"
                  style={{
                    background: `conic-gradient(
                      from 0deg,
                      #3b82f6 0deg ${intervencionesAngle}deg,
                      #f97316 ${intervencionesAngle}deg ${intervencionesAngle + licenciasAngle}deg,
                      #10b981 ${intervencionesAngle + licenciasAngle}deg 360deg
                    )`
                  }}
                />
                
                {/* Labels en el gráfico con mejor diseño */}
                <div className="absolute top-[20%] right-[25%] text-white text-xs font-bold text-center bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                  S/ {chartData.intervenciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </div>
                <div className="absolute bottom-[30%] right-[15%] text-white text-xs font-bold text-center bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                  S/ {chartData.licencias.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </div>
                <div className="absolute bottom-[20%] left-[20%] text-white text-xs font-bold text-center bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                  S/ {chartData.autorizaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Leyenda mejorada */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Desglose por Categoría</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 shadow-sm" />
                  <span className="text-sm font-medium text-gray-700">Intervenciones</span>
                </div>
                <span className="text-sm font-bold text-gray-900">S/ {chartData.intervenciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full flex-shrink-0 shadow-sm" />
                  <span className="text-sm font-medium text-gray-700">Licencia de Conducir</span>
                </div>
                <span className="text-sm font-bold text-gray-900">S/ {chartData.licencias.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 shadow-sm" />
                  <span className="text-sm font-medium text-gray-700">Autorizaciones</span>
                </div>
                <span className="text-sm font-bold text-gray-900">S/ {chartData.autorizaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
