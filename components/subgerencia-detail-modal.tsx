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
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
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
        className="!max-w-[100vw] !w-[100vw] md:!max-w-[95vw] md:!w-[95vw] xl:!max-w-[85vw] xl:!w-[85vw] 2xl:!max-w-[75vw] 2xl:!w-[75vw] h-[100vh] md:h-[90vh] overflow-x-hidden overflow-y-auto flex flex-col p-3 md:p-4 lg:p-6"
        style={{ maxWidth: '100vw', width: '100vw' }}
      >
        <DialogHeader className="border-b pb-3 md:pb-4">
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
          
          {/* Toggle de Métrica */}
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
        </DialogHeader>

        {/* Contenido principal en layout horizontal */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
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
              <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs flex-wrap">
                <div><span className="font-semibold">Año:</span> {year}</div>
                <div><span className="font-semibold">Estado:</span> {estado}</div>
                <div className="hidden md:block"><span className="font-semibold">Métrica:</span> {currentMetrica === "soles" ? "Soles" : "Cantidad"}</div>
              </div>
            </div>
          </div>

          {/* Layout vertical para móvil, horizontal para desktop */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
            {/* Gráfico de Torta */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 justify-center">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                <span>Distribución {currentMetrica === "soles" ? "de Recaudación" : "de Cantidad"}</span>
              </h4>
              <PieChart detalles={detalles} metrica={currentMetrica} />
            </div>

            {/* Detalles por tipo - grid compacto */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                <span>Detalle por Tipo de Trámite/Programa</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {detalles.map((detalle, index) => (
                    <Card 
                      key={index} 
                      className={`p-3 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 transition-all ${detalle.subtipos && detalle.subtipos.length > 0 ? 'cursor-pointer hover:shadow-lg' : ''}`}
                      onClick={() => handleTipoClick(detalle)}
                    >
                      <div className="space-y-1">
                        <h5 className="font-semibold text-gray-900 text-xs leading-tight">{detalle.tipo}</h5>
                        <div className="flex flex-col gap-0.5">
                          {currentMetrica === "soles" && detalle.soles !== undefined && (
                            <>
                              <span className="text-lg font-bold text-blue-600">
                                S/ {detalle.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </span>
                              {detalle.cantidad !== undefined && (
                                <span className="text-xs text-gray-500">
                                  {detalle.cantidad} unidades
                                </span>
                              )}
                            </>
                          )}
                          {currentMetrica === "cantidad" && detalle.cantidad !== undefined && (
                            <>
                              <span className="text-lg font-bold text-blue-600">
                                {detalle.cantidad.toLocaleString('es-PE')}
                              </span>
                              <span className="text-xs text-gray-500">unidades</span>
                              {detalle.soles !== undefined && (
                                <span className="text-xs text-gray-500">
                                  S/ {detalle.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
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
