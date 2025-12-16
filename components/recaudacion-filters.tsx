"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Calendar, Filter, DollarSign } from "lucide-react"

interface RecaudacionFiltersProps {
  selectedYear: string
  onYearChange: (year: string) => void
  selectedMonths: string[]
  onMonthsChange: (months: string[]) => void
  selectedEstado: string
  onEstadoChange: (estado: string) => void
  selectedMetrica: "soles" | "cantidad"
  onMetricaChange: (metrica: "soles" | "cantidad") => void
  selectedSubgerencias: string[]
  onSubgerenciasChange: (subgerencias: string[]) => void
  availableSubgerencias: string[]
  variant?: "card" | "inline"
}

const monthOptions = [
  { value: "Todos", label: "Todos" },
  { value: "enero", label: "Ene" },
  { value: "febrero", label: "Feb" },
  { value: "marzo", label: "Mar" },
  { value: "abril", label: "Abr" },
  { value: "mayo", label: "May" },
  { value: "junio", label: "Jun" },
  { value: "julio", label: "Jul" },
  { value: "agosto", label: "Ago" },
  { value: "septiembre", label: "Sep" },
  { value: "octubre", label: "Oct" },
  { value: "noviembre", label: "Nov" },
  { value: "diciembre", label: "Dic" }
]

function MonthMultiSelect({
  selectedMonths,
  onMonthsChange,
  variant
}: {
  selectedMonths: string[]
  onMonthsChange: (months: string[]) => void
  variant: "card" | "inline"
}) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedSummary = selectedMonths.includes("Todos")
    ? "Todos"
    : monthOptions
        .filter((p) => selectedMonths.includes(p.value))
        .map((p) => p.label)
        .join(", ") || "Seleccionar"

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const monthValues = monthOptions
      .filter((opt) => opt.value !== "Todos")
      .map((opt) => opt.value)

    if (checked) {
      if (value === "Todos") {
        onMonthsChange(["Todos", ...monthValues])
      } else {
        onMonthsChange([...selectedMonths.filter((v) => v !== "Todos"), value])
      }
    } else {
      if (value === "Todos") {
        onMonthsChange([])
      } else {
        const next = selectedMonths.filter((v) => v !== value)
        const remainingMonths = next.filter((v) => v !== "Todos")
        onMonthsChange(remainingMonths.length === 0 ? [] : next)
      }
    }
  }

  return (
    <div className={variant === "card" ? "" : "flex items-start gap-1 relative"}>
      {variant === "card" ? (
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Meses/Periodo
        </label>
      ) : (
        <span className="font-semibold text-white mt-0.5">Meses/Periodo:</span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={variant === "card" 
            ? "flex items-center gap-1 w-full bg-white border border-blue-300 hover:border-blue-500 text-gray-900 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 justify-between"
            : "flex items-center gap-1 border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70 min-w-[140px] justify-between"
          }
        >
          <span className="truncate text-left">
            {selectedSummary}
          </span>
          <span className="text-[9px]">▼</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-1 max-h-56 w-56 overflow-auto rounded-md bg-white text-gray-900 shadow-lg border border-gray-200 z-20">
            <div className="p-2 text-[11px] font-semibold text-gray-700 border-b border-gray-100">
              Selecciona meses / periodos
            </div>
            <div className="p-2 flex flex-col gap-1 text-xs">
              {monthOptions.map((p) => {
                const checked = selectedMonths.includes(p.value)
                return (
                  <label
                    key={p.value}
                    className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-3 w-3 accent-blue-600"
                      checked={checked}
                      onChange={(e) => handleCheckboxChange(p.value, e.target.checked)}
                    />
                    <span className="text-[11px]">{p.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function RecaudacionFilters({
  selectedYear,
  onYearChange,
  selectedMonths,
  onMonthsChange,
  selectedEstado,
  onEstadoChange,
  selectedMetrica,
  onMetricaChange,
  selectedSubgerencias,
  onSubgerenciasChange,
  availableSubgerencias,
  variant = "card"
}: Readonly<RecaudacionFiltersProps>) {
  const content = (
    <>
      {variant === "card" && (
        <div className="flex items-center gap-2 text-gray-900">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">Filtros Globales</h3>
        </div>
      )}

      <div className={variant === "card" ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "flex flex-wrap items-center justify-end gap-2 md:gap-3"}>
        <div className={variant === "card" ? "" : "flex items-center gap-1"}>
          {variant === "card" ? (
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Año <span className="text-red-500">*</span>
            </label>
          ) : (
            <span className="font-semibold text-white">Año:</span>
          )}
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className={variant === "card" ? "bg-white border-blue-300 hover:border-blue-500 transition-colors" : "h-7 w-[84px] border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70"}>
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

        <MonthMultiSelect
          selectedMonths={selectedMonths}
          onMonthsChange={onMonthsChange}
          variant={variant}
        />

        {variant === "card" && (
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
        )}
      </div>
    </>
  )

  if (variant === "inline") {
    return content
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-2 border-blue-200 shadow-lg">
      <div className="space-y-6">
        {content}
      </div>
    </Card>
  )
}
