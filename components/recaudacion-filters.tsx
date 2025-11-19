"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Calendar, Filter, DollarSign } from "lucide-react"

interface RecaudacionFiltersProps {
  selectedYear: string
  onYearChange: (year: string) => void
  selectedMonth: string
  onMonthChange: (month: string) => void
  selectedEstado: string
  onEstadoChange: (estado: string) => void
  selectedMetrica: "soles" | "cantidad"
  onMetricaChange: (metrica: "soles" | "cantidad") => void
  selectedSubgerencias: string[]
  onSubgerenciasChange: (subgerencias: string[]) => void
  availableSubgerencias: string[]
}

export function RecaudacionFilters({
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  selectedEstado,
  onEstadoChange,
  selectedMetrica,
  onMetricaChange,
  selectedSubgerencias,
  onSubgerenciasChange,
  availableSubgerencias
}: RecaudacionFiltersProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-2 border-blue-200 shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-gray-900">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">Filtros Globales</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Año - Obligatorio */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Año <span className="text-red-500">*</span>
            </label>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="bg-white border-blue-300 hover:border-blue-500 transition-colors">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Mes
            </label>
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="bg-white border-blue-300 hover:border-blue-500 transition-colors">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="enero">Enero</SelectItem>
                <SelectItem value="febrero">Febrero</SelectItem>
                <SelectItem value="marzo">Marzo</SelectItem>
                <SelectItem value="abril">Abril</SelectItem>
                <SelectItem value="mayo">Mayo</SelectItem>
                <SelectItem value="junio">Junio</SelectItem>
                <SelectItem value="julio">Julio</SelectItem>
                <SelectItem value="agosto">Agosto</SelectItem>
                <SelectItem value="septiembre">Septiembre</SelectItem>
                <SelectItem value="octubre">Octubre</SelectItem>
                <SelectItem value="noviembre">Noviembre</SelectItem>
                <SelectItem value="diciembre">Diciembre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Métrica - Only Soles */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Métrica (Soles)
            </label>
            <div className="flex gap-2">
              <button
                disabled
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white shadow-md cursor-default"
              >
                Soles (S/)
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
