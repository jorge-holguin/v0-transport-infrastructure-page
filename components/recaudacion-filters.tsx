"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Calendar, Filter, DollarSign, Building2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface RecaudacionFiltersProps {
  selectedYear: string
  onYearChange: (year: string) => void
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
  selectedEstado,
  onEstadoChange,
  selectedMetrica,
  onMetricaChange,
  selectedSubgerencias,
  onSubgerenciasChange,
  availableSubgerencias
}: RecaudacionFiltersProps) {
  
  const toggleSubgerencia = (subgerencia: string) => {
    if (selectedSubgerencias.includes(subgerencia)) {
      onSubgerenciasChange(selectedSubgerencias.filter(s => s !== subgerencia))
    } else {
      onSubgerenciasChange([...selectedSubgerencias, subgerencia])
    }
  }

  const selectAllSubgerencias = () => {
    if (selectedSubgerencias.length === availableSubgerencias.length) {
      onSubgerenciasChange([])
    } else {
      onSubgerenciasChange(availableSubgerencias)
    }
  }

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

          {/* Estado de Recaudación */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Estado de Recaudación
            </label>
            <Select value={selectedEstado} onValueChange={onEstadoChange}>
              <SelectTrigger className="bg-white border-blue-300 hover:border-blue-500 transition-colors">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Cobradas">Cobradas</SelectItem>
                <SelectItem value="Por cobrar">Por cobrar</SelectItem>
                <SelectItem value="Por ejecutar">Por ejecutar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Métrica - Toggle */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Métrica
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onMetricaChange("soles")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedMetrica === "soles"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-blue-300 hover:border-blue-500"
                }`}
              >
                Soles (S/)
              </button>
              <button
                onClick={() => onMetricaChange("cantidad")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedMetrica === "cantidad"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-blue-300 hover:border-blue-500"
                }`}
              >
                Cantidad
              </button>
            </div>
          </div>
        </div>

        {/* Subgerencias - Multi-select */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Subgerencias
            </label>
            <button
              onClick={selectAllSubgerencias}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              {selectedSubgerencias.length === availableSubgerencias.length ? "Deseleccionar todas" : "Seleccionar todas"}
            </button>
          </div>
          <Card className="bg-white p-4 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableSubgerencias.map((subgerencia) => (
                <div key={subgerencia} className="flex items-center space-x-2">
                  <Checkbox
                    id={subgerencia}
                    checked={selectedSubgerencias.includes(subgerencia)}
                    onCheckedChange={() => toggleSubgerencia(subgerencia)}
                  />
                  <label
                    htmlFor={subgerencia}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {subgerencia}
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Card>
  )
}
