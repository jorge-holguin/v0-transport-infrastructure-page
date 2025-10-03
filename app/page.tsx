"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Building2, CreditCard, ClipboardCheck } from "lucide-react"
import { IndicatorModal } from "@/components/indicator-modal"
import { RecaudacionCard } from "@/components/recaudacion-card"
import { PermisoCard } from "@/components/permiso-card"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <main className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/piura-city.jpg)" }}>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <header className="bg-white shadow-sm">
          {/* Light gray top bar */}
          <div className="bg-gray-100 h-6"></div>

          {/* Main navbar */}
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900 leading-tight">PLATAFORMA DE INDICADORES</h1>
                </div>
              </div>

              {/* Right side - Partner logos */}
              <div className="flex items-center gap-8">
                {/* CIMO Logo */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 leading-none">CIMO</div>
                  <div className="text-xs text-gray-600 mt-0.5">Ciudades en movimiento</div>
                </div>

                {/* PROMOVILIDAD Logo */}
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xl font-bold text-purple-600">PROMOVILIDAD</span>
                  </div>
                </div>

                {/* GIZ Logo */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600 leading-none">giz</div>
                  <div className="text-[9px] text-gray-600 leading-tight max-w-[200px]">
                    Deutsche Gesellschaft für
                    <br />
                    Internationale Zusammenarbeit (GIZ) GmbH
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blue bottom border */}
          <div className="bg-blue-500 h-1.5"></div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {!selectedCategory ? (
              // Main Category Selection
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card
                  className="bg-white/95 backdrop-blur-sm hover:bg-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
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

                <Card
                  className="bg-white/95 backdrop-blur-sm hover:bg-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCategory("permisos")}
                >
                  <div className="p-12 flex flex-col items-center text-center gap-6">
                    <ClipboardCheck className="w-24 h-24 text-blue-600 group-hover:text-white transition-colors" />
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-gray-900 group-hover:text-white transition-colors">
                        Permisos
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        Autorizaciones, licencias, intervenciones y empresas formalizadas
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
                  <Card className="bg-white/95 backdrop-blur-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                      Indicadores de Recaudación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                      <RecaudacionCard
                        id="I01"
                        title="Recaudación Total"
                        chartData={{
                          intervenciones: 14000,
                          licencias: 12000,
                          autorizaciones: 15000
                        }}
                      />
                      <RecaudacionCard
                        id="I02"
                        title="Recaudación total por autorizaciones"
                        chartData={{
                          intervenciones: 5000,
                          licencias: 0,
                          autorizaciones: 14000
                        }}
                      />
                      <RecaudacionCard
                        id="I03"
                        title="Recaudación Total por Licencia de Conducir"
                        chartData={{
                          intervenciones: 0,
                          licencias: 12000,
                          autorizaciones: 3000
                        }}
                      />
                      <RecaudacionCard
                        id="I04"
                        title="Recaudación por Intervenciones"
                        chartData={{
                          intervenciones: 14000,
                          licencias: 8000,
                          autorizaciones: 5000
                        }}
                      />
                    </div>
                  </Card>
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
