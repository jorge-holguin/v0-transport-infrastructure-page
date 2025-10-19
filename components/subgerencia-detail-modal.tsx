"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Hash, ArrowLeft } from "lucide-react"
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
    <div className="flex items-center gap-4">
      {/* Gráfico circular */}
      <div className="relative w-56 h-56 flex-shrink-0">
        <div 
          className="w-full h-full rounded-full shadow-2xl"
          style={{
            background: `conic-gradient(from 0deg, ${gradientStops})`
          }}
        />
      </div>

      {/* Leyenda a la derecha */}
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-2 gap-2">
          {segments.map((seg, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <div 
                className="w-3 h-3 rounded flex-shrink-0 shadow" 
                style={{ backgroundColor: seg.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-gray-900 truncate leading-tight">{seg.detalle.tipo}</p>
                <p className="text-[10px] text-gray-600 font-semibold">
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
        className="!max-w-[60vw] !w-[60vw] h-[90vh] overflow-hidden flex flex-col p-6"
        style={{ maxWidth: '95vw', width: '95vw' }}
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
                  NIVEL 2 - DETALLE
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {year}
                </span>
                <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {estado}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {subgerencia}
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
                  {metrica === "soles" ? "Total Recaudación" : "Total Cantidad"}
                </p>
                <p className="text-2xl font-bold">
                  {metrica === "soles" 
                    ? `S/ ${(totalSoles || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                    : `${(totalCantidad || 0).toLocaleString('es-PE')} unidades`
                  }
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div><span className="font-semibold">Año:</span> {year}</div>
                <div><span className="font-semibold">Estado:</span> {estado}</div>
                <div><span className="font-semibold">Métrica:</span> {metrica === "soles" ? "Soles" : "Cantidad"}</div>
              </div>
            </div>
          </div>

          {/* Layout horizontal: Gráfico + Leyenda */}
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Gráfico de Torta */}
            <div className="flex-shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Distribución {metrica === "soles" ? "de Recaudación" : "de Cantidad"}
              </h4>
              <PieChart detalles={detalles} metrica={metrica} />
            </div>

            {/* Detalles por tipo - grid compacto */}
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Detalle por Tipo de Trámite/Programa
              </h4>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  {detalles.map((detalle, index) => (
                    <Card 
                      key={index} 
                      className={`p-3 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 transition-all ${detalle.subtipos && detalle.subtipos.length > 0 ? 'cursor-pointer hover:shadow-lg' : ''}`}
                      onClick={() => handleTipoClick(detalle)}
                    >
                      <div className="space-y-1">
                        <h5 className="font-semibold text-gray-900 text-xs leading-tight">{detalle.tipo}</h5>
                        <div className="flex flex-col gap-0.5">
                          {metrica === "soles" && detalle.soles !== undefined && (
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
                          {metrica === "cantidad" && detalle.cantidad !== undefined && (
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
            </div>
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
