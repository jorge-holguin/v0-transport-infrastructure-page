"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CreditCard, ClipboardCheck, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { IndicatorModal } from "@/components/indicator-modal"
import { RecaudacionCard } from "@/components/recaudacion-card"
import { PermisoCard } from "@/components/permiso-card"
import { SubgerenciaCard } from "@/components/subgerencia-card"
import { RecaudacionFilters } from "@/components/recaudacion-filters"
import { Building, Users, ShieldCheck, GraduationCap, Car } from "lucide-react"
import { CustomNavbar } from "@/components/custom-navbar"
import { TipoDetailModal } from "@/components/tipo-detail-modal"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Estados para filtros de recaudación
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedMonth, setSelectedMonth] = useState("Todos")
  const [selectedEstado, setSelectedEstado] = useState("Todos")
  const [selectedMetrica, setSelectedMetrica] = useState<"soles" | "cantidad">("soles")
  const [selectedSubgerencias, setSelectedSubgerencias] = useState<string[]>([
    "Subgerencia de Transportes",
    "Subgerencia de Fiscalización",
    "Subgerencia de Tránsito y Movilidad Urbana"
  ])
  const [senalStep, setSenalStep] = useState<"subgerencia" | "horizontal" | "detalle">("subgerencia")
  const [capStep, setCapStep] = useState<"subgerencia" | "detalle">("subgerencia")

  const [capFilterYear, setCapFilterYear] = useState(selectedYear)
  const [capFilterPeriodos, setCapFilterPeriodos] = useState<string[]>(["Todos"])
  const [isCapPeriodoOpen, setIsCapPeriodoOpen] = useState(false)

  const capBaseYear = parseInt(selectedYear, 10)
  const capYearOptions = isNaN(capBaseYear)
    ? [selectedYear]
    : [capBaseYear - 2, capBaseYear - 1, capBaseYear, capBaseYear + 1, capBaseYear + 2].map(String)

  const capPeriodoOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Enero", label: "Ene" },
    { value: "Febrero", label: "Feb" },
    { value: "Marzo", label: "Mar" },
    { value: "Abril", label: "Abr" },
    { value: "Mayo", label: "May" },
    { value: "Junio", label: "Jun" },
    { value: "Julio", label: "Jul" },
    { value: "Agosto", label: "Ago" },
    { value: "Septiembre", label: "Sep" },
    { value: "Octubre", label: "Oct" },
    { value: "Noviembre", label: "Nov" },
    { value: "Diciembre", label: "Dic" }
  ]

  const capSelectedPeriodSummary = capFilterPeriodos.includes("Todos")
    ? "Todos"
    : capPeriodoOptions
        .filter((p) => capFilterPeriodos.includes(p.value))
        .map((p) => p.label)
        .join(", ") || "Seleccionar"

  const [senalFilterYear, setSenalFilterYear] = useState(selectedYear)
  const [senalFilterPeriodos, setSenalFilterPeriodos] = useState<string[]>(["Todos"])
  const [isSenalPeriodoOpen, setIsSenalPeriodoOpen] = useState(false)

  const senalBaseYear = parseInt(selectedYear, 10)
  const senalYearOptions = isNaN(senalBaseYear)
    ? [selectedYear]
    : [senalBaseYear - 2, senalBaseYear - 1, senalBaseYear, senalBaseYear + 1, senalBaseYear + 2].map(String)

  const senalPeriodoOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Enero", label: "Ene" },
    { value: "Febrero", label: "Feb" },
    { value: "Marzo", label: "Mar" },
    { value: "Abril", label: "Abr" },
    { value: "Mayo", label: "May" },
    { value: "Junio", label: "Jun" },
    { value: "Julio", label: "Jul" },
    { value: "Agosto", label: "Ago" },
    { value: "Septiembre", label: "Sep" },
    { value: "Octubre", label: "Oct" },
    { value: "Noviembre", label: "Nov" },
    { value: "Diciembre", label: "Dic" }
  ]

  const senalSelectedPeriodSummary = senalFilterPeriodos.includes("Todos")
    ? "Todos"
    : senalPeriodoOptions
        .filter((p) => senalFilterPeriodos.includes(p.value))
        .map((p) => p.label)
        .join(", ") || "Seleccionar"

  // Datos para el gráfico comparativo con avance y meta (solo recaudación)
  const subgerenciasData = [
    { 
      nombre: "Subgerencia de Transportes", 
      soles: 285000, // mismo totalSoles que la tarjeta de subgerencia
      cantidad: 1450, 
      metaSoles: 400000, // misma metaSoles que la tarjeta
      metaCantidad: 2000, 
      color: "#3b82f6" 
    },
    { 
      nombre: "Subgerencia de Fiscalización", 
      soles: 145000, // mismo totalSoles que la tarjeta
      cantidad: 850, 
      metaSoles: 180000, // misma metaSoles que la tarjeta
      metaCantidad: 1100, 
      color: "#f97316" 
    },
    { 
      nombre: "Subgerencia de Tránsito y Movilidad Urbana", 
      soles: 447304.84, // mismo totalSoles que la tarjeta de Tránsito
      cantidad: 4680, 
      metaSoles: 550000, // ajustar meta para que el cumplimiento sea < 100%
      metaCantidad: 5200, 
      color: "#10b981" 
    }
  ]

  // Totales generales para recaudado vs por recaudar (en soles)
  // Usan exactamente los mismos montos y metas que las tarjetas de subgerencia
  const totalAvance = subgerenciasData.reduce((sum, sub) => {
    const value = sub.soles
    return sum + value
  }, 0)

  const totalMeta = subgerenciasData.reduce((sum, sub) => sum + sub.metaSoles, 0)

  const pieData = [
    { name: "Recaudado", value: totalAvance },
    { name: "Por Recaudar", value: Math.max(totalMeta - totalAvance, 0) }
  ]

  // Datos mensuales: se escalan para que la suma coincida con el total recaudado
  // Distribución base proporcional para 11 meses (hasta noviembre)
  const monthlyBaseData = [
    { mes: "Enero", proporcion: 0.095 },
    { mes: "Febrero", proporcion: 0.098 },
    { mes: "Marzo", proporcion: 0.100 },
    { mes: "Abril", proporcion: 0.097 },
    { mes: "Mayo", proporcion: 0.095 },
    { mes: "Junio", proporcion: 0.092 },
    { mes: "Julio", proporcion: 0.090 },
    { mes: "Agosto", proporcion: 0.088 },
    { mes: "Septiembre", proporcion: 0.086 },
    { mes: "Octubre", proporcion: 0.084 },
    { mes: "Noviembre", proporcion: 0.075 },
    { mes: "Diciembre", proporcion: 0.0 }
  ]

  const distributeByProportion = (total: number, base: { mes: string; proporcion: number }[]) => {
    const totalCents = Math.round(total * 100)
    const cents = base.map((b) => Math.floor(totalCents * b.proporcion))
    const baseSum = cents.reduce((acc, v) => acc + v, 0)
    let remaining = Math.max(0, totalCents - baseSum)
    let i = 0
    while (remaining > 0 && cents.length > 0) {
      cents[i % cents.length] += 1
      remaining -= 1
      i += 1
    }
    return cents
  }

  const totalPendiente = Math.max(totalMeta - totalAvance, 0)
  const recaudadoCentsByMonth = distributeByProportion(totalAvance, monthlyBaseData)
  const pendienteCentsByMonth = distributeByProportion(totalPendiente, monthlyBaseData)

  const monthlyData = (() => {
    let acumuladoPendienteCents = 0
    return monthlyBaseData.map((item, idx) => {
      const recaudadoCents = recaudadoCentsByMonth[idx] || 0
      const pendienteCents = pendienteCentsByMonth[idx] || 0
      acumuladoPendienteCents += pendienteCents
      const totalProyectadoCents = recaudadoCents + pendienteCents
      return {
        mes: item.mes,
        recaudado: recaudadoCents / 100,
        porRecaudar: pendienteCents / 100,
        acumuladoPendiente: acumuladoPendienteCents / 100,
        totalProyectado: totalProyectadoCents / 100
      }
    })
  })()

  // Datos de ejemplo para Señalización Horizontal (solo m²)
  const senalizacionMensualData = [
    { mes: "Enero", m2: 4200 },
    { mes: "Febrero", m2: 4300 },
    { mes: "Marzo", m2: 4600 },
    { mes: "Abril", m2: 4800 },
    { mes: "Mayo", m2: 4400 },
    { mes: "Junio", m2: 4100 },
    { mes: "Julio", m2: 4000 },
    { mes: "Agosto", m2: 3900 },
    { mes: "Septiembre", m2: 3800 },
    { mes: "Octubre", m2: 3700 },
    { mes: "Noviembre", m2: 3600 },
    { mes: "Diciembre", m2: 4600 }
  ]

  const filteredSenalizacionMensualData = senalizacionMensualData.filter((item) => {
    if (senalFilterPeriodos.length === 0 || senalFilterPeriodos.includes("Todos")) return true
    return senalFilterPeriodos.includes(item.mes)
  })

  const maxM2Mensual = filteredSenalizacionMensualData.length
    ? Math.max(...filteredSenalizacionMensualData.map((i) => i.m2))
    : 0

  const totalM2Senalizacion = filteredSenalizacionMensualData.reduce((acc, item) => acc + item.m2, 0)

  const senalTiposConfig = [
    { tipo: "Zonas Rígidas", weight: 0.22 },
    { tipo: "Línea Separadora", weight: 0.21 },
    { tipo: "Paso Zebra (Peatonal)", weight: 0.2 },
    { tipo: "Línea de Parada", weight: 0.19 },
    { tipo: "Flecha Direccional", weight: 0.18 }
  ]

  const distributedSenalTipos = (() => {
    const base = senalTiposConfig.map((t) => Math.floor(totalM2Senalizacion * t.weight))
    const baseSum = base.reduce((acc, v) => acc + v, 0)
    let remaining = Math.max(0, totalM2Senalizacion - baseSum)
    const next = [...base]
    let i = 0
    while (remaining > 0 && next.length > 0) {
      next[i % next.length] += 1
      remaining -= 1
      i += 1
    }
    return next
  })()

  const senalizacionTiposData = senalTiposConfig.map((t, idx) => ({
    tipo: t.tipo,
    m2: distributedSenalTipos[idx] || 0
  }))

  const maxM2Tipo = Math.max(...senalizacionTiposData.map((i) => i.m2))

  // Datos de ejemplo para Capacitación
  const capacitacionMensualBaseData = [
    { mes: "Enero", vm: 1560, taxis: 624, tu: 416 },
    { mes: "Febrero", vm: 1620, taxis: 648, tu: 432 },
    { mes: "Marzo", vm: 1680, taxis: 672, tu: 448 },
    { mes: "Abril", vm: 1530, taxis: 612, tu: 408 },
    { mes: "Mayo", vm: 1500, taxis: 600, tu: 400 },
    { mes: "Junio", vm: 1470, taxis: 588, tu: 392 },
    { mes: "Julio", vm: 1440, taxis: 576, tu: 384 },
    { mes: "Agosto", vm: 1410, taxis: 564, tu: 376 },
    { mes: "Septiembre", vm: 1380, taxis: 552, tu: 368 },
    { mes: "Octubre", vm: 1350, taxis: 540, tu: 360 },
    { mes: "Noviembre", vm: 1320, taxis: 528, tu: 352 },
    { mes: "Diciembre", vm: 1290, taxis: 516, tu: 344 }
  ]

  const capacitacionMensualData = capacitacionMensualBaseData.map((item) => ({
    ...item,
    choferes: item.vm + item.taxis + item.tu
  }))

  const filteredCapacitacionMensualData = capacitacionMensualData.filter((item) => {
    if (capFilterPeriodos.length === 0 || capFilterPeriodos.includes("Todos")) return true
    return capFilterPeriodos.includes(item.mes)
  })

  const maxChoferesMensual = filteredCapacitacionMensualData.length
    ? Math.max(...filteredCapacitacionMensualData.map((i) => i.choferes))
    : 0

  const totalCapacitaciones = filteredCapacitacionMensualData.reduce((acc, item) => acc + item.choferes, 0)

  const capacitacionPorModo = [
    {
      modo: "Vehículos menores",
      cantidad: filteredCapacitacionMensualData.reduce((acc, item) => acc + item.vm, 0)
    },
    {
      modo: "Servicio de Taxi",
      cantidad: filteredCapacitacionMensualData.reduce((acc, item) => acc + item.taxis, 0)
    },
    {
      modo: "Transporte urbano",
      cantidad: filteredCapacitacionMensualData.reduce((acc, item) => acc + item.tu, 0)
    }
  ]

  const capacitacionTemasConfig = [
    { tema: "Programa de Seguridad Vial", weight: 0.4 },
    { tema: "Protocolo de Acoso Sexual", weight: 0.3 },
    { tema: "Talleres de Seguridad Vial", weight: 0.3 }
  ]

  const distributedCapTemas = (() => {
    const base = capacitacionTemasConfig.map((t) => Math.floor(totalCapacitaciones * t.weight))
    const baseSum = base.reduce((acc, v) => acc + v, 0)
    let remaining = Math.max(0, totalCapacitaciones - baseSum)
    const next = [...base]
    let i = 0
    while (remaining > 0 && next.length > 0) {
      next[i % next.length] += 1
      remaining -= 1
      i += 1
    }
    return next
  })()

  const capacitacionTemasData = capacitacionTemasConfig.map((t, idx) => ({
    tema: t.tema,
    choferes: distributedCapTemas[idx] || 0
  }))

  const maxChoferesTema = Math.max(...capacitacionTemasData.map((i) => i.choferes))

  return (
    <main className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/piura-city.jpg)" }}>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <CustomNavbar />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
              Municipalidad Provincial de Piura
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]">Visor de Indicadores de Transporte</h1>
          </div>
          <div className={selectedCategory ? "max-w-7xl mx-auto" : "max-w-6xl mx-auto"}>
            {!selectedCategory ? (
              // Main Category Selection - 4 Categories
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
                <Card
                  className="w-full bg-white/95 backdrop-blur-sm hover:bg-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCategory("recaudacion")}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <CreditCard className="w-16 h-16 text-blue-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Recaudación
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Montos totales recaudados por subgerencias
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="w-full bg-white/95 backdrop-blur-sm hover:bg-green-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => { setSelectedCategory("capacitacion"); setCapStep("subgerencia") }}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <GraduationCap className="w-16 h-16 text-green-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Capacitación
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Capacitaciones viales realizadas
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="w-full bg-white/95 backdrop-blur-sm hover:bg-orange-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => { setSelectedCategory("senalizaciones"); setSenalStep("subgerencia") }}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <Building className="w-16 h-16 text-orange-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Señalización
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Tipos de señalización
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="w-full bg-white/95 backdrop-blur-sm hover:bg-purple-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCategory("parque-automotor")}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <Car className="w-16 h-16 text-purple-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Parque Automotor Antigüedad
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Análisis de antigüedad vehicular
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              // Indicator Details View
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mb-6 px-6 py-3 bg-white/95 hover:bg-white text-gray-900 font-semibold rounded-lg shadow-md transition-all"
                >
                  ← Volver a categorías
                </button>

                {selectedCategory === "recaudacion" && (
                  <div className="space-y-6">
                    {/* Gráfico Comparativo General */}
                    <Card className="bg-white/95 backdrop-blur-sm p-8">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-1">
                          <CreditCard className="w-8 h-8 text-blue-600" />
                          Indicadores de la Gerencia de Transportes
                        </h3>
                        <p className="text-lg text-gray-600 ml-11">Recaudación</p>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-900 mb-6">
                        Recaudación Total por la Gerencia de Transporte y Movilidad Urbana
                      </h4>
                      
                      {/* Total destacado */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white shadow-lg mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex gap-6">
                            <div className="rounded-lg bg-green-500/20 border border-green-300/30 px-4 py-3">
                              <p className="text-blue-100 text-xs font-medium mb-1">Monto Recaudado</p>
                              <p className="text-2xl font-bold">
                                S/ {totalAvance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div className="rounded-lg bg-red-500/20 border border-red-300/30 px-4 py-3">
                              <p className="text-blue-100 text-xs font-medium mb-1">Monto Pendiente de Recaudación</p>
                              <p className="text-2xl font-bold">
                                S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div className="rounded-lg bg-sky-500/20 border border-sky-300/30 px-4 py-3">
                              <p className="text-blue-100 text-xs font-medium mb-1">Recaudación Total Proyectada</p>
                              <p className="text-2xl font-bold">
                                S/ {totalMeta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div className="rounded-lg bg-white/10 border border-white/20 px-4 py-3">
                              <p className="text-blue-100 text-xs font-medium mb-1">Cumplimiento</p>
                              <p className="text-2xl font-bold">
                                {(totalMeta > 0 ? ((totalAvance / totalMeta) * 100) : 0).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <RecaudacionFilters
                              selectedYear={selectedYear}
                              onYearChange={setSelectedYear}
                              selectedEstado={selectedEstado}
                              onEstadoChange={setSelectedEstado}
                              selectedMetrica={selectedMetrica}
                              onMetricaChange={setSelectedMetrica}
                              selectedSubgerencias={selectedSubgerencias}
                              onSubgerenciasChange={setSelectedSubgerencias}
                              availableSubgerencias={[
                                "Subgerencia de Transportes",
                                "Subgerencia de Fiscalización",
                                "Subgerencia de Tránsito y Movilidad Urbana"
                              ]}
                              selectedMonth={selectedMonth}
                              onMonthChange={setSelectedMonth}
                              variant="inline"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Layout: Gráfico de Torta + Gráfico de Barras */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Gráfico de Torta General */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <h5 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-blue-600" />
                            Recaudado vs Por Recaudar
                          </h5>
                          <div className="flex items-center gap-6">
                            <div className="w-48 h-48">
                              <ResponsiveContainer>
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    labelLine={false}
                                  >
                                    <Cell fill="#16a34a" />
                                    <Cell fill="#ef4444" />
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-4 h-4 rounded-full bg-green-500" />
                                <span className="text-sm font-medium">Recaudado</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-4 h-4 rounded-full bg-red-500" />
                                <span className="text-sm font-medium">Por Recaudar</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Gráfico de Barras por Mes (Stacked: Recaudado + Por Recaudar) */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <h5 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            Recaudación por Mes (Porcentajes)
                          </h5>
                          <div className="w-full h-64">
                            <ResponsiveContainer>
                              <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="mes" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={70} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                  formatter={(value) => `S/ ${(value as number).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="recaudado" stackId="a" fill="#16a34a" name="Recaudado" />
                                <Bar dataKey="porRecaudar" stackId="a" fill="#ef4444" name="Por Recaudar" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Tabla de Recaudación por Mes */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h5 className="text-sm font-semibold text-gray-700 mb-4">Recaudación Mensual por la Gerencia de Transporte y Movilidad Urbana</h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mes</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Monto Recaudado</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Monto Pendiente de Recaudación</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Monto Acumulado Pendiente de Recaudación</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Recaudación Total Proyectada</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthlyData.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4 text-gray-700">{item.mes}</td>
                                  <td className="py-3 px-4 text-right font-medium text-green-600">
                                    S/ {item.recaudado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="py-3 px-4 text-right font-medium text-red-600">
                                    S/ {item.porRecaudar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                    S/ {item.acumuladoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="py-3 px-4 text-right font-bold text-sky-700">
                                    S/ {item.totalProyectado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-gray-300 font-bold">
                                <td className="py-3 px-4 text-gray-900">TOTAL</td>
                                <td className="py-3 px-4 text-right text-green-600">
                                  S/ {totalAvance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right text-red-600">
                                  S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-900">
                                  S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right text-sky-700">
                                  S/ {totalMeta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </Card>

                    {/* Tarjetas de Nivel 1 - Subgerencias */}
                    <Card className="bg-white/95 backdrop-blur-sm p-8">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                        <h4 className="text-lg font-semibold text-red-600">
                          Recaudación Total por las SubGerencias de la Gerencia de Transporte y Movilidad Urbana
                        </h4>

                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3 rounded-lg text-white shadow-md">
                          <RecaudacionFilters
                            selectedYear={selectedYear}
                            onYearChange={setSelectedYear}
                            selectedEstado={selectedEstado}
                            onEstadoChange={setSelectedEstado}
                            selectedMetrica={selectedMetrica}
                            onMetricaChange={setSelectedMetrica}
                            selectedSubgerencias={selectedSubgerencias}
                            onSubgerenciasChange={setSelectedSubgerencias}
                            availableSubgerencias={[
                              "Subgerencia de Transportes",
                              "Subgerencia de Fiscalización",
                              "Subgerencia de Tránsito y Movilidad Urbana"
                            ]}
                            selectedMonth={selectedMonth}
                            onMonthChange={setSelectedMonth}
                            variant="inline"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Subgerencia de Fiscalización */}
                        {selectedSubgerencias.includes("Subgerencia de Fiscalización") && (
                          <SubgerenciaCard
                            nombre="Subgerencia de Fiscalización"
                            titulo="Monto recaudado por Subgerencia de Fiscalización"
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={145000}
                            totalCantidad={850}
                            cantidadLabel="Actas de Control"
                            metaSoles={180000}
                            metaCantidad={1100}
                            icon={<ShieldCheck className="w-6 h-6" />}
                            detalles={[
                              { 
                                tipo: "Intervenciones", 
                                soles: 145000, 
                                cantidad: 850,
                                subtipos: [
                                  { subtipo: "PJ01 - Pago con descuento", soles: 55000, cantidad: 330 },
                                  { subtipo: "PJ02 - Pago ordinario", soles: 42000, cantidad: 250 },
                                  { subtipo: "PJ03 - Pago fraccionado", soles: 33000, cantidad: 190 },
                                  { subtipo: "C01 - Citación primera", soles: 5000, cantidad: 30 },
                                  { subtipo: "C02 - Citación segunda", soles: 6000, cantidad: 35 },
                                  { subtipo: "C03 - Citación final", soles: 4000, cantidad: 15 }
                                ]
                              }
                            ]}
                          />
                        )}

                        {/* Subgerencia de Transportes */}
                        {selectedSubgerencias.includes("Subgerencia de Transportes") && (
                          <SubgerenciaCard
                            nombre="Subgerencia de Transportes"
                            titulo="Monto recaudado por Subgerencia de Transportes"
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={285000}
                            totalCantidad={1450}
                            metaSoles={400000}
                            metaCantidad={2000}
                            showDonut={false}
                            icon={<Building className="w-6 h-6" />}
                            detalles={[
                              { 
                                tipo: "Transporte Especial de Trabajadores", 
                                soles: 63000, 
                                cantidad: 330,
                                subtipos: [
                                  { subtipo: "Autorización", soles: 35000, cantidad: 180 },
                                  { subtipo: "Habilitación Vehicular (TUC)", soles: 28000, cantidad: 150 }
                                ]
                              },
                              { 
                                tipo: "Transporte Especial de Turismo", 
                                soles: 57000, 
                                cantidad: 300,
                                subtipos: [
                                  { subtipo: "Autorización", soles: 32000, cantidad: 160 },
                                  { subtipo: "Habilitación Vehicular (TUC)", soles: 25000, cantidad: 140 }
                                ]
                              },
                              { 
                                tipo: "Transporte Especial Estudiantes", 
                                soles: 48000, 
                                cantidad: 270,
                                subtipos: [
                                  { subtipo: "Autorización", soles: 22000, cantidad: 120 },
                                  { subtipo: "Renovación", soles: 18000, cantidad: 100 },
                                  { subtipo: "Duplicados", soles: 8000, cantidad: 50 }
                                ]
                              },
                              { 
                                tipo: "Transporte Urbano", 
                                soles: 53000, 
                                cantidad: 255,
                                subtipos: [
                                  { subtipo: "Sustitución", soles: 20000, cantidad: 90 },
                                  { subtipo: "Habilitación", soles: 15000, cantidad: 80 },
                                  { subtipo: "Autorización", soles: 18000, cantidad: 85 }
                                ]
                              },
                              { 
                                tipo: "Carga/Descarga", 
                                soles: 12000, 
                                cantidad: 70,
                                subtipos: [
                                  { subtipo: "Autorizaciones", soles: 12000, cantidad: 70 }
                                ]
                              },
                              { 
                                tipo: "Vehículos Menores", 
                                soles: 36000, 
                                cantidad: 210,
                                subtipos: [
                                  { subtipo: "Renovación", soles: 10000, cantidad: 60 },
                                  { subtipo: "Incremento de flota", soles: 8000, cantidad: 45 },
                                  { subtipo: "Sustitución de flota", soles: 7000, cantidad: 40 },
                                  { subtipo: "Emisión TUC", soles: 6000, cantidad: 35 },
                                  { subtipo: "Renovación TUC", soles: 5000, cantidad: 30 }
                                ]
                              },
                              { 
                                tipo: "Certificación", 
                                soles: 13000, 
                                cantidad: 83,
                                subtipos: [
                                  { subtipo: "Taxis", soles: 3000, cantidad: 20 },
                                  { subtipo: "Vehículos menores", soles: 2500, cantidad: 18 },
                                  { subtipo: "Transporte Urbano", soles: 2000, cantidad: 15 },
                                  { subtipo: "Transporte Especial Estudiantes", soles: 1800, cantidad: 12 },
                                  { subtipo: "Transporte Especial Trabajadores", soles: 1700, cantidad: 10 },
                                  { subtipo: "Transporte Especial Turismo", soles: 2000, cantidad: 8 }
                                ]
                              },
                              { 
                                tipo: "Taxis Dispersos", 
                                soles: 3500, 
                                cantidad: 22,
                                subtipos: [
                                  { subtipo: "Autorización", soles: 2000, cantidad: 12 },
                                  { subtipo: "Renovación TUC", soles: 1500, cantidad: 10 }
                                ]
                              },
                              { 
                                tipo: "Taxis Remix", 
                                soles: 4800, 
                                cantidad: 35,
                                subtipos: [
                                  { subtipo: "Autorización", soles: 1800, cantidad: 11 },
                                  { subtipo: "Habilitaciones", soles: 1200, cantidad: 9 },
                                  { subtipo: "Renovación TUC", soles: 1000, cantidad: 8 },
                                  { subtipo: "Sustitución Vehicular", soles: 800, cantidad: 7 }
                                ]
                              }
                            ]}
                          />
                        )}

                        {/* Subgerencia de Tránsito y Movilidad Urbana */}
                        {selectedSubgerencias.includes("Subgerencia de Tránsito y Movilidad Urbana") && (
                          <SubgerenciaCard
                            nombre="Subgerencia de Tránsito y Movilidad Urbana"
                            titulo="Monto recaudado por Subgerencia de Tránsito y Movilidad Urbana"
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={447304.84}
                            totalCantidad={4680}
                            metaSoles={550000}
                            metaCantidad={5200}
                            showDonut={false}
                            icon={<Users className="w-6 h-6" />}
                            detalles={[
                              { 
                                tipo: "Infracciones de transporte 2025", 
                                soles: 252304.84, 
                                cantidad: 1830,
                                subtipos: [
                                  { subtipo: "Prestar el servicio en un vehículo no habilitado - Muy Grave", soles: 164615.84, cantidad: 1194 },
                                  { subtipo: "Por estacionarse en zonas prohibidas (paraderos informales, cruceros peatonales y zonas rígidas) - Muy Grave", soles: 10746.56, cantidad: 280 },
                                  { subtipo: "PRESTAR SERVICIO DE TRANSPORTES DE PERSONAS SIN CONTAR CON AUTORIZACION MUNICIPAL", soles: 31285.79, cantidad: 227 },
                                  { subtipo: "POR UTILIZAR LA VIA PUBLICA COMO PARADERO", soles: 19683.68, cantidad: 78 },
                                  { subtipo: "CIRCULAR CON UNIDADES VEHICULARES SIN LOS ELEMENTOS DE IDENTIFICACION DEL SERVICIO DE TAXI", soles: 10596.80, cantidad: 42 },
                                  { subtipo: "Prohibir el tránsito y estacionamiento de vehículos cuatrimotos en las zonas urbanas en el ámbito de la Provincia de Piura y la red vial provincial RESPONSABLE: PROPIETARIO, GRAVEDAD:", soles: 13386.17, cantidad: 5 },
                                  { subtipo: "Otros", soles: 1990.00, cantidad: 4 }
                                ]
                              },
                              { 
                                tipo: "Licencia Conducir Clase B-IIB", 
                                soles: 140000, 
                                cantidad: 2250,
                                subtipos: [
                                  { subtipo: "Emisión", soles: 80000, cantidad: 1200 },
                                  { subtipo: "Revalidación", soles: 45000, cantidad: 750 },
                                  { subtipo: "Duplicado", soles: 15000, cantidad: 300 }
                                ]
                              },
                              { 
                                tipo: "Licencia Conducir Clase B-IIC", 
                                soles: 55000, 
                                cantidad: 600,
                                subtipos: [
                                  { subtipo: "Emisión", soles: 35000, cantidad: 400 },
                                  { subtipo: "Revalidación", soles: 15000, cantidad: 150 },
                                  { subtipo: "Duplicado", soles: 5000, cantidad: 50 }
                                ]
                              },
                            ]}
                          />
                        )}

                      </div>
                    </Card>

                   </div>
                )}

                {selectedCategory === "capacitacion" && (
                  <div className="space-y-6">
                    {capStep === "subgerencia" && (
                      <Card className="bg-white/95 backdrop-blur-sm p-8 cursor-pointer hover:shadow-lg transition-all" onClick={() => setCapStep("detalle")}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                              <GraduationCap className="w-8 h-8 text-green-600" />
                              Sub. Seguridad Educación Vial
                            </h3>
                            <p className="text-gray-600">Capacitaciones viales realizadas por la Subgerencia de Seguridad y Educación Vial</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {capStep === "detalle" && (
                      <Card className="bg-white/95 backdrop-blur-sm p-8 space-y-6">
                        {/* Banner total choferes - mismo formato que otros encabezados */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-lg text-white shadow-lg mb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-green-100 text-xs font-medium mb-1">Total personas capacitadas</p>
                              <p className="text-2xl font-bold">
                                {totalCapacitaciones.toLocaleString('es-PE')} personas capacitadas
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center md:items-center justify-end gap-2 md:gap-3 text-[10px] md:text-xs">
                              <div className="flex items-center gap-1">
                                <span className="font-semibold">Año:</span>
                                <select
                                  value={capFilterYear}
                                  onChange={(e) => setCapFilterYear(e.target.value)}
                                  className="border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70"
                                >
                                  {capYearOptions.map((y) => (
                                    <option key={y} value={y} className="text-gray-900">
                                      {y}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-start gap-1 relative">
                                <span className="font-semibold mt-0.5">Meses/Periodo:</span>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setIsCapPeriodoOpen((prev) => !prev)}
                                    className="flex items-center gap-1 border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70 min-w-[140px] justify-between"
                                  >
                                    <span className="truncate text-left">
                                      {capSelectedPeriodSummary}
                                    </span>
                                    <span className="text-[9px]">▼</span>
                                  </button>
                                  {isCapPeriodoOpen && (
                                    <div className="absolute right-0 mt-1 max-h-56 w-56 overflow-auto rounded-md bg-white text-gray-900 shadow-lg border border-gray-200 z-20">
                                      <div className="p-2 text-[11px] font-semibold text-gray-700 border-b border-gray-100">
                                        Selecciona meses / periodos
                                      </div>
                                      <div className="p-2 flex flex-col gap-1 text-xs">
                                        {capPeriodoOptions.map((p) => {
                                          const checked = capFilterPeriodos.includes(p.value)
                                          return (
                                            <label
                                              key={p.value}
                                              className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-100 cursor-pointer"
                                            >
                                              <input
                                                type="checkbox"
                                                className="h-3 w-3 accent-blue-600"
                                                checked={checked}
                                                onChange={(e) => {
                                                  setCapFilterPeriodos((prev) => {
                                                    const monthValues = capPeriodoOptions
                                                      .filter((opt) => opt.value !== "Todos")
                                                      .map((opt) => opt.value)

                                                    if (e.target.checked) {
                                                      if (p.value === "Todos") {
                                                        return ["Todos", ...monthValues]
                                                      }
                                                      return [...prev.filter((v) => v !== "Todos"), p.value]
                                                    }

                                                    if (p.value === "Todos") {
                                                      return []
                                                    }

                                                    const next = prev.filter((v) => v !== p.value)
                                                    const remainingMonths = next.filter((v) => v !== "Todos")
                                                    return remainingMonths.length === 0 ? [] : next
                                                  })
                                                }}
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
                            </div>
                          </div>
                        </div>

                        {/* Capacitaciones por temas */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Capacitaciones por temas
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {capacitacionTemasData.map((item) => (
                              <div key={item.tema} className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-center shadow-sm">
                                <p className="text-sm font-semibold text-gray-900">
                                  {item.choferes.toLocaleString('es-PE')} Personas capacitadas en
                                </p>
                                <p className="text-xs text-gray-700 mt-1">{item.tema}</p>
                              </div>
                            ))}
                          </div>

                          <p className="mt-4 text-xs md:text-sm text-gray-700 font-semibold bg-green-50 border border-green-200 rounded-md px-3 py-2">
                            Las capacitaciones del Programa de Seguridad Vial es obligatorio para obtener sus permisos de circulación
                          </p>
                        </div>

                        {/* Capacitaciones por modo de transporte */}
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-gray-900">Capacitaciones por modo de transporte</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {capacitacionPorModo.map((item) => (
                              <div key={item.modo} className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-center shadow-sm">
                                <p className="text-sm font-semibold text-gray-900">
                                  {item.cantidad.toLocaleString('es-PE')} personas capacitadas
                                </p>
                                <p className="text-xs text-gray-700 mt-1">en {item.modo.toLowerCase()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total de Choferes capacitados por mes */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Total de Personas capacitadas por mes
                          </h4>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              {filteredCapacitacionMensualData.map((item) => (
                                <div key={item.mes} className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-600 w-20">{item.mes}</span>
                                  <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                                    <div
                                      className="bg-green-500 h-full rounded-full transition-all"
                                      style={{ width: `${maxChoferesMensual ? (item.choferes / maxChoferesMensual) * 100 : 0}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Vehículo Menores</th>
                                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Taxis</th>
                                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Transporte Urbano</th>
                                    <th className="text-right py-2 px-2 font-semibold text-gray-700">Total de Personas capacitadas por mes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredCapacitacionMensualData.map((item) => (
                                    <tr key={item.mes} className="border-b hover:bg-gray-50">
                                      <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                                      <td className="py-2 px-2 text-right font-medium text-gray-900">{item.vm.toLocaleString('es-PE')}</td>
                                      <td className="py-2 px-2 text-right font-medium text-gray-900">{item.taxis.toLocaleString('es-PE')}</td>
                                      <td className="py-2 px-2 text-right font-medium text-gray-900">{item.tu.toLocaleString('es-PE')}</td>
                                      <td className="py-2 px-2 text-right font-medium text-gray-900">{item.choferes.toLocaleString('es-PE')}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* Sección de Certificaciones (temporalmente deshabilitada)
                {selectedCategory === "certificaciones" && (
                  <TipoDetailModal
                    isOpen={true}
                    onClose={() => setSelectedCategory(null)}
                    subgerencia="Subgerencia de Tránsito y Movilidad Urbana"
                    tipo="Certificaciones"
                    year={selectedYear}
                    metrica="cantidad"
                    estado={selectedEstado}
                    subtipos={[
                      { subtipo: "Emisiones", cantidad: 18000 }
                    ]}
                    totalCantidad={18000}
                  />
                )}
                */}

                {selectedCategory === "senalizaciones" && (
                  <div className="space-y-6">
                    {senalStep === "subgerencia" && (
                      <Card className="bg-white/95 backdrop-blur-sm p-8 cursor-pointer hover:shadow-lg transition-all" onClick={() => setSenalStep("horizontal")}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                              <Building className="w-8 h-8 text-orange-600" />
                              Subgerencia de Tránsito y Movilidad Urbana
                            </h3>
                            <p className="text-gray-600">Indicadores de Señalización dentro de la Subgerencia de Tránsito</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {senalStep === "horizontal" && (
                      <Card className="bg-white/95 backdrop-blur-sm p-8 cursor-pointer hover:shadow-lg transition-all" onClick={() => setSenalStep("detalle")}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                              <Building className="w-8 h-8 text-orange-600" />
                              Señales Horizontales de vías
                            </h3>
                            <p className="text-gray-600">Señalización horizontal para mantenimiento de vías</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {senalStep === "detalle" && (
                      <Card className="bg-white/95 backdrop-blur-sm p-8 space-y-6">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Building className="w-8 h-8 text-orange-600" />
                            Subgerencia de Tránsito y Movilidad Urbana → Señales Horizontales de vías
                          </h3>
                          <p className="text-lg text-gray-600 font-semibold">M2 de señalización horizontal</p>
                        </div>

                        {/* Total m2 destacado */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-lg text-white shadow-lg mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-orange-100 text-xs font-medium mb-1">Total intervenido</p>
                              <p className="text-2xl font-bold">{totalM2Senalizacion.toLocaleString("es-PE")} m²</p>
                            </div>
                            <div className="flex flex-wrap items-center md:items-center justify-end gap-2 md:gap-3 text-[10px] md:text-xs">
                              <div className="flex items-center gap-1">
                                <span className="font-semibold">Año:</span>
                                <select
                                  value={senalFilterYear}
                                  onChange={(e) => setSenalFilterYear(e.target.value)}
                                  className="border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70"
                                >
                                  {senalYearOptions.map((y) => (
                                    <option key={y} value={y} className="text-gray-900">
                                      {y}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-start gap-1 relative">
                                <span className="font-semibold mt-0.5">Meses/Periodo:</span>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setIsSenalPeriodoOpen((prev) => !prev)}
                                    className="flex items-center gap-1 border border-white/40 bg-white/10 text-white text-[10px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/70 min-w-[140px] justify-between"
                                  >
                                    <span className="truncate text-left">
                                      {senalSelectedPeriodSummary}
                                    </span>
                                    <span className="text-[9px]">▼</span>
                                  </button>
                                  {isSenalPeriodoOpen && (
                                    <div className="absolute right-0 mt-1 max-h-56 w-56 overflow-auto rounded-md bg-white text-gray-900 shadow-lg border border-gray-200 z-20">
                                      <div className="p-2 text-[11px] font-semibold text-gray-700 border-b border-gray-100">
                                        Selecciona meses / periodos
                                      </div>
                                      <div className="p-2 flex flex-col gap-1 text-xs">
                                        {senalPeriodoOptions.map((p) => {
                                          const checked = senalFilterPeriodos.includes(p.value)
                                          return (
                                            <label
                                              key={p.value}
                                              className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-100 cursor-pointer"
                                            >
                                              <input
                                                type="checkbox"
                                                className="h-3 w-3 accent-blue-600"
                                                checked={checked}
                                                onChange={(e) => {
                                                  setSenalFilterPeriodos((prev) => {
                                                    const monthValues = senalPeriodoOptions
                                                      .filter((opt) => opt.value !== "Todos")
                                                      .map((opt) => opt.value)

                                                    if (e.target.checked) {
                                                      if (p.value === "Todos") {
                                                        return ["Todos", ...monthValues]
                                                      }
                                                      return [...prev.filter((v) => v !== "Todos"), p.value]
                                                    }

                                                    if (p.value === "Todos") {
                                                      return []
                                                    }

                                                    const next = prev.filter((v) => v !== p.value)
                                                    const remainingMonths = next.filter((v) => v !== "Todos")
                                                    return remainingMonths.length === 0 ? [] : next
                                                  })
                                                }}
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
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Registro de Mantenimiento de Señalización Horizontal por tipo */}
                          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                              Registro de Mantenimiento de Señalización Horizontal por tipo
                            </h4>

                            <div className="grid grid-cols-1 gap-3">
                              {senalizacionTiposData.map((item) => (
                                <div key={item.tipo} className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between">
                                  <div>
                                    <p className="text-lg font-bold text-gray-900">{item.m2.toLocaleString('es-PE')} m²</p>
                                    <p className="text-sm text-orange-700 font-medium">{item.tipo}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Registro de Mantenimiento de Señalización Horizontal por Mes */}
                          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                              Registro de Mantenimiento de Señalización Horizontal por Mes
                            </h4>

                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Mes</th>
                                    <th className="text-right py-2 px-2 font-semibold text-gray-700">M2 intervenidos</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredSenalizacionMensualData.map((item) => (
                                    <tr key={item.mes} className="border-b hover:bg-gray-50">
                                      <td className="py-2 px-2 text-gray-700">{item.mes}</td>
                                      <td className="py-2 px-2 text-right font-medium text-gray-900">{item.m2.toLocaleString('es-PE')} m²</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {selectedCategory === "permisos" && (
                  <Card className="bg-white/95 backdrop-blur-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <ClipboardCheck className="w-8 h-8 text-blue-600" />
                      Indicadores de Permisos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                      <PermisoCard
                        id="P01"
                        title="Número de permisos de circulación"
                        chartData={{
                          enero: 120,
                          febrero: 135,
                          marzo: 150,
                          abril: 142,
                          mayo: 168,
                          junio: 155,
                          julio: 178,
                          agosto: 165,
                          septiembre: 190,
                          octubre: 182,
                          noviembre: 175,
                          diciembre: 160
                        }}
                      />
                      <PermisoCard
                        id="P02"
                        title="Número de autorizaciones"
                        chartData={{
                          enero: 85,
                          febrero: 92,
                          marzo: 88,
                          abril: 95,
                          mayo: 110,
                          junio: 105,
                          julio: 118,
                          agosto: 112,
                          septiembre: 125,
                          octubre: 130,
                          noviembre: 122,
                          diciembre: 115
                        }}
                      />
                      <PermisoCard
                        id="P03"
                        title="Número de emisión de brevetes"
                        chartData={{
                          enero: 200,
                          febrero: 215,
                          marzo: 230,
                          abril: 225,
                          mayo: 245,
                          junio: 238,
                          julio: 260,
                          agosto: 255,
                          septiembre: 270,
                          octubre: 265,
                          noviembre: 258,
                          diciembre: 250
                        }}
                      />
                      <PermisoCard
                        id="P04"
                        title="Número de Intervenciones"
                        chartData={{
                          enero: 45,
                          febrero: 52,
                          marzo: 48,
                          abril: 55,
                          mayo: 62,
                          junio: 58,
                          julio: 68,
                          agosto: 65,
                          septiembre: 72,
                          octubre: 70,
                          noviembre: 66,
                          diciembre: 60
                        }}
                      />
                      <PermisoCard
                        id="P05"
                        title="Número de empresas de taxi formalizadas"
                        chartData={{
                          enero: 12,
                          febrero: 15,
                          marzo: 18,
                          abril: 16,
                          mayo: 20,
                          junio: 22,
                          julio: 25,
                          agosto: 23,
                          septiembre: 28,
                          octubre: 30,
                          noviembre: 27,
                          diciembre: 25
                        }}
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
