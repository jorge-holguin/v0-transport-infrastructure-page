"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, ArrowLeft } from "lucide-react"

interface SubgerenciaData {
  nombre: string
  soles: number
  cantidad: number
  color: string
}

interface ComparativoSubgerenciasModalProps {
  isOpen: boolean
  onClose: () => void
  year: string
  metrica: "soles" | "cantidad"
  subgerencias: SubgerenciaData[]
}

export function ComparativoSubgerenciasModal({
  isOpen,
  onClose,
  year,
  metrica,
  subgerencias
}: ComparativoSubgerenciasModalProps) {
  const [tipoRecaudacion, setTipoRecaudacion] = useState<"cobradas" | "por-cobrar">("cobradas")

  // Calcular total basado en el tipo de recaudación
  // Para este ejemplo, usamos los valores actuales para "cobradas"
  // y calculamos un porcentaje para "por cobrar" (30% del total)
  const total = subgerencias.reduce((sum, sub) => {
    const value = metrica === "soles" ? sub.soles : sub.cantidad
    const adjustedValue = tipoRecaudacion === "cobradas" ? value : value * 0.3
    return sum + adjustedValue
  }, 0)

  // Calcular porcentajes para cada subgerencia según tipo de recaudación
  const segments = subgerencias.map((sub) => {
    const baseValue = metrica === "soles" ? sub.soles : sub.cantidad
    const value = tipoRecaudacion === "cobradas" ? baseValue : baseValue * 0.3
    const percentage = total > 0 ? (value / total) * 100 : 0
    return {
      subgerencia: sub,
      value,
      percentage
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="!max-w-[100vw] !w-[100vw] md:!max-w-[95vw] md:!w-[95vw] xl:!max-w-[85vw] xl:!w-[85vw] 2xl:!max-w-[75vw] 2xl:!w-[75vw] h-[100vh] md:h-[85vh] overflow-x-hidden overflow-y-auto flex flex-col p-3 md:p-4 lg:p-6"
        style={{ maxWidth: '100vw', width: '100vw' }}
      >
        <DialogHeader className="border-b pb-4">
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
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  COMPARATIVO GENERAL
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {year}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Recaudación por Subgerencia - Gerencia de Transportes y Movilidad Urbana
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Contenido principal en layout horizontal */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Total destacado - compacto */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg text-white shadow-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium mb-1">
                  {metrica === "soles" ? "Total Recaudación General" : "Total Cantidad General"}
                </p>
                <p className="text-2xl font-bold">
                  {metrica === "soles" 
                    ? `S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                    : `${total.toLocaleString('es-PE')} unidades`
                  }
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div><span className="font-semibold">Año:</span> {year}</div>
                <div><span className="font-semibold">Métrica:</span> {metrica === "soles" ? "Soles (S/)" : "Cantidad"}</div>
                <div><span className="font-semibold">Subgerencias:</span> {subgerencias.length}</div>
              </div>
            </div>
          </div>

          {/* Layout: Gráfico de Barras + Leyenda */}
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* Gráfico de Barras Horizontales */}
            <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs lg:text-sm font-semibold text-gray-700 mb-3 lg:mb-4 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                Distribución por Subgerencia
              </h4>
              <div className="w-full">
                {/* Gráfico de barras horizontales */}
                <div className="space-y-4">
                  {segments.map((seg, index) => {
                    const maxValue = Math.max(...segments.map(s => s.value))
                    const barWidth = total > 0 ? (seg.value / maxValue) * 100 : 0
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700 flex-1 min-w-0 pr-4">
                            {seg.subgerencia.nombre}
                          </span>
                          <span className="font-bold text-blue-600 whitespace-nowrap">
                            {seg.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                          <div 
                            className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                            style={{ 
                              width: `${barWidth}%`,
                              backgroundColor: seg.subgerencia.color
                            }}
                          >
                            <span className="text-white font-bold text-sm">
                              {metrica === "soles" 
                                ? `S/ ${seg.value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                                : `${seg.value.toLocaleString('es-PE')} unidades`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Selector de Tipo de Recaudación */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  Tipo de Recaudación:
                </label>
                <Select value={tipoRecaudacion} onValueChange={(value: "cobradas" | "por-cobrar") => setTipoRecaudacion(value)}>
                  <SelectTrigger className="max-w-xs bg-white border-blue-300 hover:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cobradas">Cuentas Cobradas</SelectItem>
                    <SelectItem value="por-cobrar">Cuentas por Cobrar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Leyenda consolidada en un solo cuadro */}
            <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h5 className="text-xs lg:text-sm font-bold text-gray-900 mb-3 lg:mb-4 uppercase tracking-wide">Leyenda - Subgerencias</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {segments.map((seg, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded flex-shrink-0 shadow-md" 
                      style={{ backgroundColor: seg.subgerencia.color }}
                    />
                    <span className="text-sm text-gray-700 font-medium leading-tight">
                      {seg.subgerencia.nombre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
