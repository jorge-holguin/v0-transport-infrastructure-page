"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Hash, ArrowLeft } from "lucide-react"

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
  '#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b',
  '#06b6d4', '#6366f1', '#14b8a6', '#f43f5e', '#84cc16', '#a855f7'
]

// Componente de gráfico de torta para Nivel 3
function SubtipoPieChart({ subtipos, metrica }: { subtipos: SubtipoDetalle[], metrica: "soles" | "cantidad" }) {
  const total = subtipos.reduce((sum, subtipo) => {
    const value = metrica === "soles" ? (subtipo.soles || 0) : (subtipo.cantidad || 0)
    return sum + value
  }, 0)

  if (total === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No hay datos disponibles
      </div>
    )
  }

  let currentAngle = 0
  const segments = subtipos.map((subtipo, index) => {
    const value = metrica === "soles" ? (subtipo.soles || 0) : (subtipo.cantidad || 0)
    const percentage = (value / total) * 100
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
                <p className="text-[10px] font-medium text-gray-900 truncate leading-tight">{seg.subtipo.subtipo}</p>
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

export function TipoDetailModal({
  isOpen,
  onClose,
  subgerencia,
  tipo,
  year,
  metrica,
  estado,
  subtipos,
  totalSoles,
  totalCantidad
}: TipoDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="!max-w-[60vw] !w-[60vw] h-[90vh] overflow-hidden flex flex-col p-6"
        style={{ maxWidth: '60vw', width: '60vw' }}
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
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Total destacado - compacto */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg text-white shadow-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs font-medium mb-1">
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

          {/* Layout horizontal: Gráfico + Detalles */}
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Gráfico de Torta */}
            <div className="flex-shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Distribución por Subtipo
              </h4>
              <SubtipoPieChart subtipos={subtipos} metrica={metrica} />
            </div>

            {/* Detalles por subtipo - grid compacto */}
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Detalle por Subtipo
              </h4>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-3">
                  {subtipos.map((subtipo, index) => (
                    <Card key={index} className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400 transition-all">
                      <div className="space-y-1">
                        <h5 className="font-semibold text-gray-900 text-xs leading-tight">{subtipo.subtipo}</h5>
                        <div className="flex flex-col gap-0.5">
                          {metrica === "soles" && subtipo.soles !== undefined && (
                            <>
                              <span className="text-lg font-bold text-purple-600">
                                S/ {subtipo.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </span>
                              {subtipo.cantidad !== undefined && (
                                <span className="text-xs text-gray-500">
                                  {subtipo.cantidad} unidades
                                </span>
                              )}
                            </>
                          )}
                          {metrica === "cantidad" && subtipo.cantidad !== undefined && (
                            <>
                              <span className="text-lg font-bold text-purple-600">
                                {subtipo.cantidad.toLocaleString('es-PE')}
                              </span>
                              <span className="text-xs text-gray-500">unidades</span>
                              {subtipo.soles !== undefined && (
                                <span className="text-xs text-gray-500">
                                  S/ {subtipo.soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
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
  )
}
