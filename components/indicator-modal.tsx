"use client"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronRight, Info } from "lucide-react"

interface IndicatorModalProps {
  id: string
  name: string
  group: string
  description: string
  formula: string
  unit: string
  frequency: string
  source: string
  responsible: string
}

export function IndicatorModal({
  id,
  name,
  group,
  description,
  formula,
  unit,
  frequency,
  source,
  responsible,
}: IndicatorModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{id}</span>
                <span className="text-xs text-gray-500">{group}</span>
              </div>
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-blue-600 font-bold">{id}</span>
            <span className="text-gray-400">|</span>
            <span>{name}</span>
          </DialogTitle>
          <DialogDescription className="text-left">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              {group}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Descripción
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Fórmula</h4>
            <p className="text-gray-700 text-sm font-mono">{formula}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Unidad de medida</h4>
              <p className="text-gray-700 text-sm">{unit}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Frecuencia</h4>
              <p className="text-gray-700 text-sm">{frequency}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm">Fuente de Información</h4>
            <p className="text-gray-700 text-sm">{source}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm">Responsable</h4>
            <p className="text-gray-700 text-sm">{responsible}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
