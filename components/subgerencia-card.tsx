"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"
import { DollarSign, Hash, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { SubgerenciaDetailModal } from "./subgerencia-detail-modal"
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

interface SubgerenciaCardProps {
  nombre: string
  year: string
  metrica: "soles" | "cantidad"
  estado: string
  totalSoles?: number
  totalCantidad?: number
  metaSoles?: number
  metaCantidad?: number
  detalles: DetalleNivel2[]
  icon?: React.ReactNode
}

export function SubgerenciaCard({
  nombre,
  year,
  metrica,
  estado,
  totalSoles,
  totalCantidad,
  metaSoles,
  metaCantidad,
  detalles,
  icon
}: SubgerenciaCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Check if soles data is available
  const hasSolesData = totalSoles !== undefined && totalSoles > 0
  
  const displayValue = !hasSolesData || metrica === "cantidad"
    ? `${(totalCantidad || 0).toLocaleString('es-PE')}`
    : `S/ ${(totalSoles || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`

  const hasSingleTipo = detalles.length === 1

  // Datos para gráfico de torta Recaudado vs Por recaudar (mismo criterio que ComparativoSubgerenciasModal)
  const metaValue = metrica === "soles" ? metaSoles : metaCantidad
  const avanceValue = metrica === "soles" ? totalSoles : totalCantidad
  const hasMetaData = metaValue !== undefined && metaValue > 0 && avanceValue !== undefined && avanceValue >= 0

  const recaudadoValue = hasMetaData ? avanceValue ?? 0 : 0
  const porRecaudarValue = hasMetaData ? Math.max((metaValue ?? 0) - recaudadoValue, 0) : 0

  const pieData = hasMetaData
    ? [
        { name: "Recaudado", value: recaudadoValue },
        { name: "Por recaudar", value: porRecaudarValue }
      ]
    : []

  const recaudadoPercent = hasMetaData && metaValue
    ? Math.min(Math.round((recaudadoValue / metaValue) * 100), 100)
    : 0
  const porRecaudarPercent = hasMetaData ? Math.max(100 - recaudadoPercent, 0) : 0

  const handleClick = () => {
    setIsDetailOpen(true)
  }

  return (
    <>
      <Card 
        className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-blue-500 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50"
        onClick={handleClick}
      >
        <div className="space-y-4">
          {/* Header con icono */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-tight">
                {nombre}
              </h3>
            </div>
            {icon && (
              <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                {icon}
              </div>
            )}
          </div>

          {/* Valor principal */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {!hasSolesData || metrica === "cantidad" ? (
                <>
                  <Hash className="w-3 h-3" />
                  <span>Cantidad</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-3 h-3" />
                  <span>Recaudación</span>
                </>
              )}
            </div>
            <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
              {displayValue}
            </p>
            {hasSolesData && metrica === "soles" && !!totalCantidad && (
              <p className="text-xs text-gray-500">{totalCantidad.toLocaleString('es-PE')} trámites</p>
            )}
            {metrica === "cantidad" && hasSolesData && !!totalSoles && (
              <p className="text-xs text-gray-500">S/ {totalSoles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            )}
          </div>

          {/* Gráfico de torta Recaudado vs Por recaudar */}
          {hasMetaData && (
            <div className="mt-4 flex items-center gap-4">
              <div className="w-24 h-24">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={24}
                      outerRadius={40}
                      stroke="transparent"
                    >
                      <Cell key="recaudado" fill="#16a34a" />
                      <Cell key="por-recaudar" fill="#f97316" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                  <span>
                    Recaudado: {recaudadoPercent}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500" />
                  <span>
                    Por recaudar: {porRecaudarPercent}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer con info adicional */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
            <span className="text-gray-600">{year}</span>
            <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{estado}</span>
          </div>

          {/* Indicador de click */}
          <div className="flex items-center justify-center text-xs text-blue-600 group-hover:text-blue-700 font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            Ver detalle
          </div>
        </div>
      </Card>

      {hasSingleTipo ? (
        <TipoDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          subgerencia={nombre}
          tipo={detalles[0].tipo}
          year={year}
          metrica={metrica}
          estado={estado}
          subtipos={detalles[0].subtipos || []}
          totalSoles={detalles[0].soles ?? totalSoles}
          totalCantidad={detalles[0].cantidad ?? totalCantidad}
        />
      ) : (
        <SubgerenciaDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          subgerencia={nombre}
          year={year}
          metrica={metrica}
          estado={estado}
          detalles={detalles}
          totalSoles={totalSoles}
          totalCantidad={totalCantidad}
        />
      )}
    </>
  )
}
