"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CreditCard, ClipboardCheck } from "lucide-react"
import { IndicatorModal } from "@/components/indicator-modal"
import { RecaudacionCard } from "@/components/recaudacion-card"
import { PermisoCard } from "@/components/permiso-card"
import { SubgerenciaCard } from "@/components/subgerencia-card"
import { RecaudacionFilters } from "@/components/recaudacion-filters"
import { ComparativoSubgerenciasModal } from "@/components/comparativo-subgerencias-modal"
import { Building, Users, ShieldCheck, GraduationCap, BarChart3 } from "lucide-react"
import { CustomNavbar } from "@/components/custom-navbar"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Estados para filtros de recaudación
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedEstado, setSelectedEstado] = useState("Todos")
  const [selectedMetrica, setSelectedMetrica] = useState<"soles" | "cantidad">("soles")
  const [selectedSubgerencias, setSelectedSubgerencias] = useState<string[]>([
    "Subgerencia de Transportes",
    "Subgerencia de Fiscalización",
    "Subgerencia de Tránsito y Movilidad Urbana",
    "Subgerencia de Seguridad y Educación Vial"
  ])
  const [showComparativo, setShowComparativo] = useState(false)

  // Datos para el gráfico comparativo con avance y meta
  const subgerenciasData = [
    { 
      nombre: "Subgerencia de Transportes", 
      soles: 285000, 
      cantidad: 1450, 
      metaSoles: 400000, 
      metaCantidad: 2000, 
      color: "#3b82f6" 
    },
    { 
      nombre: "Subgerencia de Fiscalización", 
      soles: 145000, 
      cantidad: 850, 
      metaSoles: 180000, 
      metaCantidad: 1100, 
      color: "#f97316" 
    },
    { 
      nombre: "Subgerencia de Tránsito y Movilidad Urbana", 
      soles: 195000, 
      cantidad: 2850, 
      metaSoles: 220000, 
      metaCantidad: 3200, 
      color: "#10b981" 
    },
    { 
      nombre: "Subgerencia de Seguridad y Educación Vial", 
      soles: 45000, 
      cantidad: 450, 
      metaSoles: 60000, 
      metaCantidad: 600, 
      color: "#8b5cf6" 
    }
  ]

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
          <div className={selectedCategory === "recaudacion" ? "max-w-7xl mx-auto" : "max-w-4xl mx-auto"}>
            {!selectedCategory ? (
              // Main Category Selection
              <div className="flex justify-center">
                <Card
                  className="bg-white/95 backdrop-blur-sm hover:bg-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer group max-w-md w-full"
                  onClick={() => setSelectedCategory("recaudacion")}
                >
                  <div className="p-12 flex flex-col items-center text-center gap-6">
                    <CreditCard className="w-24 h-24 text-blue-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Recaudación
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Montos totales recaudados por autorizaciones, brevetes e intervenciones
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
                          "Subgerencia de Tránsito y Movilidad Urbana",
                          "Subgerencia de Seguridad y Educación Vial"
                        ]}
                      />

                      {/* Botón para ver gráfico comparativo */}
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => setShowComparativo(true)}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3"
                        >
                          <BarChart3 className="w-6 h-6" />
                          Ver Gráfico de Recaudación de las Subgerencias
                        </button>
                      </div>
                    </Card>

                    {/* Tarjetas de Nivel 1 - Subgerencias */}
                    <Card className="bg-white/95 backdrop-blur-sm p-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-6">
                        Nivel 1 - Resumen por Subgerencia
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Subgerencia de Fiscalización */}
                        {selectedSubgerencias.includes("Subgerencia de Fiscalización") && (
                          <SubgerenciaCard
                            nombre="Subgerencia de Fiscalización"
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={145000}
                            totalCantidad={850}
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
                            icon={<Users className="w-6 h-6" />}
                            detalles={[
                              { 
                                tipo: "Infracciones de transporte 2025", 
                                soles: 252304.84, 
                                cantidad: 1830,
                                subtipos: [
                                  { subtipo: "Prestar el servicio en un vehículo no habilitado - Muy Grave", soles: 164500, cantidad: 1194 },
                                  { subtipo: "Por estacionarse en zonas prohibidas (paraderos informales, cruceros peatonales y zonas rígidas) - Muy Grave", soles: 10730, cantidad: 280 },
                                  { subtipo: "PRESTAR SEVICIO DE TRANSPORTES DE PERSONAS SIN CONTAR CON AUTORIZACION MUNICIPAL", soles: 31300, cantidad: 227 },
                                  { subtipo: "POR UTILIZAR LA VIA PUBLICA COMO PARADERO", soles: 11900, cantidad: 78 },
                                  { subtipo: "CIRCULAR CON UNIDADES VEHICULARES SIN LOS ELEMENTOS DE IDENTIFICACION DEL SERVICIO DE TAXI", soles: 6400, cantidad: 42 },
                                  { subtipo: "Prohibir el tránsito y estacionamiento de vehículos cuatrimotos en las zonas urbanas en el ámbito de la Provincia de Piura y la red vial provincial RESPONSABLE: PROPIETARIO. GRAVEDAD:", soles: 750, cantidad: 5 },
                                  { subtipo: "Otros", soles: 600, cantidad: 4 }
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
                              { 
                                tipo: "Certificaciones", 
                                soles: 0, 
                                cantidad: 0,
                                subtipos: [
                                  { subtipo: "Emisiones", soles: 0, cantidad: 0 }
                                ]
                              },
                              { 
                                tipo: "Señalización Horizontal Vías", 
                                soles: 0, 
                                cantidad: 0,
                                subtipos: [
                                  { subtipo: "m2", soles: 0, cantidad: 0 },
                                  { subtipo: "km", soles: 0, cantidad: 0 }
                                ]
                              }
                            ]}
                          />
                        )}

                        {/* Subgerencia de Seguridad y Educación Vial */}
                        {selectedSubgerencias.includes("Subgerencia de Seguridad y Educación Vial") && (
                          <SubgerenciaCard
                            nombre="Subgerencia de Seguridad y Educación Vial"
                            year={selectedYear}
                            metrica={selectedMetrica}
                            estado={selectedEstado}
                            totalSoles={45000}
                            totalCantidad={450}
                            icon={<GraduationCap className="w-6 h-6" />}
                            detalles={[
                              { 
                                tipo: "Capacitación Vial", 
                                soles: 45000, 
                                cantidad: 450,
                                subtipos: [
                                  { subtipo: "Capacitación para Vehículos menores", soles: 18000, cantidad: 180 },
                                  { subtipo: "Capacitación para Taxi", soles: 15000, cantidad: 150 },
                                  { subtipo: "Capacitación para Transporte urbano", soles: 12000, cantidad: 120 }
                                ]
                              }
                            ]}
                          />
                        )}
                      </div>
                    </Card>

                    {/* Modal Comparativo */}
                    <ComparativoSubgerenciasModal
                      isOpen={showComparativo}
                      onClose={() => setShowComparativo(false)}
                      year={selectedYear}
                      metrica={selectedMetrica}
                      subgerencias={subgerenciasData}
                    />
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
