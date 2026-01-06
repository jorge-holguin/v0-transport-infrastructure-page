"use client"

import { Card } from "@/components/ui/card"
import { CreditCard, ArrowLeft } from "lucide-react"
import { SubgerenciaCard } from "@/components/subgerencia-card"
import { transportesDetalles } from "./data"
import { ManualUsoPDF } from "@/components/shared/ManualUsoPDF"

interface SubgerenciaTransporteViewProps {
  onBack: () => void
  selectedYear: string
}

export function SubgerenciaTransporteView({ onBack, selectedYear }: SubgerenciaTransporteViewProps) {
  // Calcular totales desde los datos
  const totalSoles = transportesDetalles.reduce((sum, d) => sum + d.soles, 0)
  const totalCantidad = transportesDetalles.reduce((sum, d) => sum + d.cantidad, 0)

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm p-8">
        {/* Botón Atrás en recuadro blanco */}
        <div className="mb-4 flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SubgerenciaCard
            nombre="Subgerencia de Transportes"
            titulo="Monto recaudado por Subgerencia de Transportes"
            year={selectedYear}
            metrica="soles"
            estado="Todos"
            totalSoles={totalSoles}
            totalCantidad={totalCantidad}
            metaSoles={400000}
            metaCantidad={2000}
            showDonut={true}
            icon={<CreditCard className="w-6 h-6" />}
            detalles={transportesDetalles}
          />
        </div>
      </Card>

      <ManualUsoPDF />
    </div>
  )
}
