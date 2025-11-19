"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CreditCard, ClipboardCheck, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { IndicatorModal } from "@/components/indicator-modal"
import { RecaudacionCard } from "@/components/recaudacion-card"
import { PermisoCard } from "@/components/permiso-card"
import { SubgerenciaCard } from "@/components/subgerencia-card"
import { RecaudacionFilters } from "@/components/recaudacion-filters"
import { Building, Users, ShieldCheck, GraduationCap } from "lucide-react"
import { CustomNavbar } from "@/components/custom-navbar"
import { TipoDetailModal } from "@/components/tipo-detail-modal"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [tipoRecaudacion, setTipoRecaudacion] = useState<"cobradas" | "por-cobrar">("cobradas")

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
    const adjustedValue = tipoRecaudacion === "cobradas" ? value : value * 0.3
    return sum + adjustedValue
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

  const monthlyData = monthlyBaseData.map((item) => {
    const recaudado = totalAvance * item.proporcion
    const porRecaudar = (totalMeta * item.proporcion) - recaudado
    return {
      mes: item.mes,
      recaudado: recaudado,
      porRecaudar: Math.max(porRecaudar, 0)
    }
  })

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
          <div className={selectedCategory ? "max-w-7xl mx-auto" : "max-w-5xl mx-auto"}>
            {!selectedCategory ? (
              // Main Category Selection - 4 Categories
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <Card
                  className="bg-white/95 backdrop-blur-sm hover:bg-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
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
                  className="bg-white/95 backdrop-blur-sm hover:bg-green-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCategory("capacitacion")}
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
                  className="bg-white/95 backdrop-blur-sm hover:bg-purple-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCategory("certificaciones")}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <ShieldCheck className="w-16 h-16 text-purple-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Certificaciones
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Certificaciones emitidas
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="bg-white/95 backdrop-blur-sm hover:bg-orange-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCategory("senalizaciones")}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <Building className="w-16 h-16 text-orange-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Señalizaciones
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Señalización horizontal de vías
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
                    <Card className="bg-white/95 backdrop-blur-sm p-8">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                          <CreditCard className="w-8 h-8 text-blue-600" />
                          Indicadores de la Gerencia de Transportes
                        </h3>
                        <p className="text-lg text-gray-600 ml-11">Primera Versión del Tablero de Indicadores</p>
                      </div>
                      
                      {/* Filtros Globales */}
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
                      />

                    </Card>

                    {/* Gráfico Comparativo General */}
                    <Card className="bg-white/95 backdrop-blur-sm p-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-6">
                        Resumen General de Recaudación
                      </h4>
                      
                      {/* Total destacado */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white shadow-lg mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex gap-6">
                            <div>
                              <p className="text-blue-100 text-xs font-medium mb-1">Total Recaudado</p>
                              <p className="text-2xl font-bold">
                                S/ {totalAvance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-blue-100 text-xs font-medium mb-1">Total Por Recaudar</p>
                              <p className="text-2xl font-bold">
                                S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-blue-100 text-xs font-medium mb-1">Meta Total</p>
                              <p className="text-2xl font-bold">
                                S/ {totalMeta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-blue-100 text-xs font-medium mb-1">Cumplimiento</p>
                              <p className="text-2xl font-bold">
                                {(totalMeta > 0 ? ((totalAvance / totalMeta) * 100) : 0).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <div><span className="font-semibold">Año:</span> {selectedYear}</div>
                            <div><span className="font-semibold">Métrica:</span> {selectedMetrica === "soles" ? "Soles (S/)" : "Cantidad"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Selector de Tipo de Recaudación */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm mb-6">
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
                                    <Cell fill="#f97316" />
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
                                <span className="inline-block w-4 h-4 rounded-full bg-orange-500" />
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
                                <Bar dataKey="porRecaudar" stackId="a" fill="#f97316" name="Por Recaudar" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Tabla de Recaudación por Mes */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h5 className="text-sm font-semibold text-gray-700 mb-4">Recaudación Mensual</h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mes</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Recaudado</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Por Recaudar</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthlyData.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4 text-gray-700">{item.mes}</td>
                                  <td className="py-3 px-4 text-right font-medium text-green-600">
                                    S/ {item.recaudado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="py-3 px-4 text-right font-medium text-orange-600">
                                    S/ {item.porRecaudar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                                    S/ {(item.recaudado + item.porRecaudar).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
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
                                <td className="py-3 px-4 text-right text-orange-600">
                                  S/ {Math.max(totalMeta - totalAvance, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-900">
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
                      <h4 className="text-lg font-semibold text-gray-900 mb-6">
                        Nivel 1 - Resumen por Subgerencia
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Subgerencia de Fiscalización */}
                        {selectedSubgerencias.includes("Subgerencia de Fiscalización") && (
                          <SubgerenciaCard
                            nombre="Subgerencia de Fiscalización"
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={145000}
                            totalCantidad={850}
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
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={285000}
                            totalCantidad={1450}
                            metaSoles={400000}
                            metaCantidad={2000}
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
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={447304.84}
                            totalCantidad={4680}
                            metaSoles={550000}
                            metaCantidad={5200}
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
                  <TipoDetailModal
                    isOpen={true}
                    onClose={() => setSelectedCategory(null)}
                    subgerencia="Subgerencia de Seguridad y Educación Vial"
                    tipo="Capacitación Vial"
                    year={selectedYear}
                    metrica="cantidad"
                    estado={selectedEstado}
                    subtipos={[
                      { subtipo: "Capacitación para Vehículos menores", cantidad: 18000 },
                      { subtipo: "Capacitación para Taxi", cantidad: 7200 },
                      { subtipo: "Capacitación para Transporte urbano", cantidad: 5400 }
                    ]}
                    totalCantidad={30600}
                  />
                )}

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

                {selectedCategory === "senalizaciones" && (
                  <TipoDetailModal
                    isOpen={true}
                    onClose={() => setSelectedCategory(null)}
                    subgerencia="Subgerencia de Tránsito y Movilidad Urbana"
                    tipo="Señalización Horizontal Vías"
                    year={selectedYear}
                    metrica="cantidad"
                    estado={selectedEstado}
                    subtipos={[
                      { subtipo: "m2", cantidad: 5 },
                      { subtipo: "km", cantidad: 30 }
                    ]}
                    totalCantidad={35}
                  />
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
