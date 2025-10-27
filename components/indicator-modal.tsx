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
import { ChevronRight, Info, FileText, Calculator, BarChart3, Clock, Database, Users } from "lucide-react"

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
        <Card className="group p-5 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-blue-500 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{id}</span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{group}</span>
              </div>
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
            </div>
            <div className="flex-shrink-0 ml-4 w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl !max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="border-b pb-4 px-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">{id}</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {group}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 pb-6">
        <div className="space-y-6 pt-4">
          {/* Descripción */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Descripción
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Fórmula */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Fórmula de Cálculo
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm font-mono leading-relaxed">{formula}</p>
            </div>
          </div>

          {/* Información técnica */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Información Técnica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <h5 className="font-semibold text-gray-900 text-sm">Unidad de medida</h5>
                </div>
                <p className="text-gray-700 text-sm">{unit}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h5 className="font-semibold text-gray-900 text-sm">Frecuencia</h5>
                </div>
                <p className="text-gray-700 text-sm">{frequency}</p>
              </div>
            </div>
          </div>

          {/* Fuente y Responsable */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 text-sm mb-1">Fuente de Información</h5>
                  <p className="text-gray-700 text-sm">{source}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 text-sm mb-1">Responsable</h5>
                  <p className="text-gray-700 text-sm">{responsible}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
