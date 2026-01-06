"use client"

import { Card } from "@/components/ui/card"
import { CreditCard, ArrowLeft, ShieldCheck } from "lucide-react"
import { SubgerenciaCard } from "@/components/subgerencia-card"
import { fiscalizacionDetalles } from "./data"
import { ManualUsoPDF } from "@/components/shared/ManualUsoPDF"

interface SubgerenciaFiscalizacionViewProps {
  onBack: () => void
  selectedYear: string
}

export function SubgerenciaFiscalizacionView({ onBack, selectedYear }: SubgerenciaFiscalizacionViewProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm p-8">
        {/* Botón Atrás en recuadro blanco */}
        <div className="mb-4 flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-1">
            <ShieldCheck className="w-8 h-8 text-green-600" />
            Subgerencia de Fiscalización → Intervenciones
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SubgerenciaCard
            nombre="Subgerencia de Fiscalización"
            titulo="Monto Proyectado para recaudación por Subgerencia de Fiscalización"
            year={selectedYear}
            metrica="soles"
            estado="Todos"
            totalSoles={145000}
            totalCantidad={850}
            cantidadLabel="Actas de Control"
            metaSoles={190000}
            metaCantidad={1100}
            icon={<ShieldCheck className="w-6 h-6" />}
            detalles={fiscalizacionDetalles}
          />
        </div>
      </Card>

      <ManualUsoPDF />
    </div>
  )
}
