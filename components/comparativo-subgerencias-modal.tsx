"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, ArrowLeft } from "lucide-react"

interface SubgerenciaData {
  nombre: string
  soles: number
  cantidad: number
  metaSoles: number
  metaCantidad: number
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

  // Calcular total de avance y meta
  const totalAvance = subgerencias.reduce((sum, sub) => {
    const value = metrica === "soles" ? sub.soles : sub.cantidad
    const adjustedValue = tipoRecaudacion === "cobradas" ? value : value * 0.3
    return sum + adjustedValue
  }, 0)

  const totalMeta = subgerencias.reduce((sum, sub) => {
    const meta = metrica === "soles" ? sub.metaSoles : sub.metaCantidad
    return sum + meta
  }, 0)

  // Calcular datos para cada subgerencia
  const segments = subgerencias.map((sub) => {
    const baseValue = metrica === "soles" ? sub.soles : sub.cantidad
    const avance = tipoRecaudacion === "cobradas" ? baseValue : baseValue * 0.3
    const meta = metrica === "soles" ? sub.metaSoles : sub.metaCantidad
    const percentage = totalAvance > 0 ? (avance / totalAvance) * 100 : 0
    const cumplimiento = meta > 0 ? (avance / meta) * 100 : 0
    const brecha = meta - avance
    
    return {
      subgerencia: sub,
      avance,
      meta,
      percentage,
      cumplimiento,
      brecha
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="!max-w-[100vw] !w-[100vw] md:!max-w-[95vw] md:!w-[95vw] xl:!max-w-[85vw] xl:!w-[85vw] 2xl:!max-w-[75vw] 2xl:!w-[75vw] !max-h-[90vh] p-0 flex flex-col"
        style={{ maxWidth: '100vw', width: '100vw' }}
      >
        <DialogHeader className="border-b pb-4 px-3 md:px-4 lg:px-6 pt-3 md:pt-4 lg:pt-6">
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
        <div className="overflow-y-auto px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6">
          {/* Total destacado - compacto */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg text-white shadow-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">Avance Total</p>
                  <p className="text-2xl font-bold">
                    {metrica === "soles" 
                      ? `S/ ${totalAvance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                      : `${totalAvance.toLocaleString('es-PE')} unidades`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">Meta Total</p>
                  <p className="text-2xl font-bold">
                    {metrica === "soles" 
                      ? `S/ ${totalMeta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                      : `${totalMeta.toLocaleString('es-PE')} unidades`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">Cumplimiento</p>
                  <p className="text-2xl font-bold">
                    {totalMeta > 0 ? ((totalAvance / totalMeta) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div><span className="font-semibold">Año:</span> {year}</div>
                <div><span className="font-semibold">Métrica:</span> {metrica === "soles" ? "Soles (S/)" : "Cantidad"}</div>
                <div><span className="font-semibold">Subgerencias:</span> {subgerencias.length}</div>
              </div>
            </div>
          </div>

          {/* Layout: Gráfico de Barras + Leyenda */}
          <div className="flex flex-col gap-4">
            {/* Gráfico de Barras Horizontales */}
            <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs lg:text-sm font-semibold text-gray-700 mb-3 lg:mb-4 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                Distribución por Subgerencia
              </h4>
              <div className="w-full">
                {/* Gráfico de barras horizontales con avance y meta */}
                <div className="space-y-6">
                  {segments.map((seg, index) => {
                    const maxValue = Math.max(...segments.map(s => s.meta))
                    const avanceWidth = maxValue > 0 ? (seg.avance / maxValue) * 100 : 0
                    
                    // Determinar color del cumplimiento
                    let cumplimientoColor = 'text-red-600'
                    if (seg.cumplimiento >= 100) {
                      cumplimientoColor = 'text-green-600'
                    } else if (seg.cumplimiento >= 75) {
                      cumplimientoColor = 'text-blue-600'
                    } else if (seg.cumplimiento >= 50) {
                      cumplimientoColor = 'text-orange-600'
                    }
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700 flex-1 min-w-0 pr-4">
                            {seg.subgerencia.nombre}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">
                              Cumplimiento:
                            </span>
                            <span className={`font-bold whitespace-nowrap ${cumplimientoColor}`}>
                              {seg.cumplimiento.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Barra de avance sobre fondo de meta */}
                        <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {/* Barra de avance */}
                          <div 
                            className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                            style={{ 
                              width: `${avanceWidth}%`,
                              backgroundColor: seg.subgerencia.color
                            }}
                          >
                            <span className="text-white font-bold text-sm">
                              {metrica === "soles" 
                                ? `S/ ${seg.avance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                                : `${seg.avance.toLocaleString('es-PE')}`
                              }
                            </span>
                          </div>
                          
                          {/* Indicador de meta (línea vertical) */}
                          <div className="absolute inset-y-0 right-0 w-1 bg-gray-800"></div>
                        </div>
                        
                        {/* Información de avance y meta */}
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-4">
                            <span>
                              <span className="font-semibold">Avance:</span>{' '}
                              {metrica === "soles" 
                                ? `S/ ${seg.avance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                                : `${seg.avance.toLocaleString('es-PE')} unidades`
                              }
                            </span>
                            <span>
                              <span className="font-semibold">Meta:</span>{' '}
                              {metrica === "soles" 
                                ? `S/ ${seg.meta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                                : `${seg.meta.toLocaleString('es-PE')} unidades`
                              }
                            </span>
                          </div>
                          <span className={seg.brecha > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                            {seg.brecha > 0 ? 'Brecha: ' : 'Superado: '}
                            {metrica === "soles" 
                              ? `S/ ${Math.abs(seg.brecha).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                              : `${Math.abs(seg.brecha).toLocaleString('es-PE')} unidades`
                            }
                          </span>
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
