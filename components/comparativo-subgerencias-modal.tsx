"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingUp, DollarSign, Hash, ArrowLeft } from "lucide-react"

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
  // Calcular total
  const total = subgerencias.reduce((sum, sub) => {
    const value = metrica === "soles" ? sub.soles : sub.cantidad
    return sum + value
  }, 0)

  // Calcular ángulos para cada segmento
  let currentAngle = 0
  const segments = subgerencias.map((sub) => {
    const value = metrica === "soles" ? sub.soles : sub.cantidad
    const percentage = total > 0 ? (value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const segment = {
      subgerencia: sub,
      value,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    }
    currentAngle += angle
    return segment
  })

  // Crear el gradiente cónico
  const gradientStops = segments.map((seg) => {
    return `${seg.subgerencia.color} ${seg.startAngle}deg ${seg.endAngle}deg`
  }).join(', ')

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

          {/* Layout horizontal: Gráfico + Leyenda */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-0 bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            {/* Gráfico circular */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <h4 className="text-xs lg:text-sm font-semibold text-gray-700 mb-3 lg:mb-4 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                <span className="hidden lg:inline">Distribución por Subgerencia</span>
                <span className="lg:hidden">Distribución</span>
              </h4>
              <div className="relative w-[280px] h-[280px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[400px]">
                <div 
                  className="w-full h-full rounded-full shadow-2xl"
                  style={{
                    background: total > 0 ? `conic-gradient(from 0deg, ${gradientStops})` : '#e5e7eb'
                  }}
                />
              </div>
            </div>

            {/* Leyenda horizontal */}
            <div className="flex-1 min-w-0 flex flex-col">
              <h5 className="text-xs lg:text-sm font-bold text-gray-900 mb-3 lg:mb-4 uppercase tracking-wide">Leyenda - Subgerencias</h5>
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 content-start">
                {segments.map((seg, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-6 h-6 rounded flex-shrink-0 shadow-md mt-1" 
                        style={{ backgroundColor: seg.subgerencia.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-sm mb-2 leading-tight">
                          {seg.subgerencia.nombre}
                        </h5>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xl font-bold text-blue-600">
                            {seg.percentage.toFixed(1)}%
                          </span>
                          <span className="text-sm text-gray-700 font-semibold">
                            {metrica === "soles" 
                              ? `S/ ${seg.value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                              : `${seg.value.toLocaleString('es-PE')} unidades`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
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
