"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Building2, CreditCard, ClipboardCheck } from "lucide-react"
import { IndicatorModal } from "@/components/indicator-modal"

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
                    <div className="space-y-4">
                      <IndicatorModal
                        id="I01"
                        name="Monto total recaudado por autorizaciones"
                        group="RECAUDACIÓN"
                        description="Refleja el total de ingresos económicos obtenidos por la emisión de autorizaciones vinculadas al transporte durante un periodo determinado."
                        formula="Monto total recaudado = Σ Ingresos registrados por autorizaciones emitidas"
                        unit="S/ (Sol Peruano)"
                        frequency="Mensual"
                        source="Sistema tributario de SATP"
                        responsible="Gerencia de Transporte y Movilidad Urbana"
                      />
                      <IndicatorModal
                        id="I02"
                        name="Monto total de recaudación de brevetes"
                        group="RECAUDACIÓN"
                        description="Refleja el total de ingresos obtenidos por la emisión, renovación y/o recategorización de licencias de conducir durante un periodo."
                        formula="Monto total recaudado = Σ Ingresos por trámites de brevetes"
                        unit="S/ (Sol Peruano)"
                        frequency="Mensual"
                        source="Sistema tributario de SATP"
                        responsible="Gerencia de Transporte y Movilidad Urbana"
                      />
                      <IndicatorModal
                        id="I03"
                        name="Monto total de recaudación por intervenciones"
                        group="RECAUDACIÓN"
                        description="Mide de total de ingresos obtenidos por la realización de intervenciones vinculadas al control, fiscalización o gestión del transporte."
                        formula="Monto total recaudado = Σ Ingresos generados por intervenciones"
                        unit="S/ (Sol Peruano)"
                        frequency="Mensual"
                        source="Sistema tributario de SATP"
                        responsible="SATP"
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
                    <div className="space-y-4">
                      <IndicatorModal
                        id="I04"
                        name="Número de permisos de circulación"
                        group="PERMISOS"
                        description="Mide la cantidad total de permisos de circulación otorgados a vehículos de transporte durante un periodo determinado."
                        formula="Número de permisos de circulación = Σ Permisos emitidos en el periodo"
                        unit="Número de permisos"
                        frequency="Mensual"
                        source="Sistema de tramite documentario"
                        responsible="Gerencia de Transporte y Movilidad Urbana"
                      />
                      <IndicatorModal
                        id="I05"
                        name="Número de autorizaciones"
                        group="PERMISOS"
                        description="Mide la cantidad total de autorizaciones otorgadas para actividades relacionadas con el transporte durante un periodo determinado."
                        formula="Número de autorizaciones = Σ Permisos emitidos en el periodo"
                        unit="Número de autorizaciones"
                        frequency="Mensual"
                        source="Sistema de tramite documentario"
                        responsible="Gerencia de Transporte y Movilidad Urbana"
                      />
                      <IndicatorModal
                        id="I06"
                        name="Número de emisión de brevetes"
                        group="PERMISOS"
                        description="Mide la cantidad de licencias de conducir emitidas durante un periodo determinado, incluyendo nuevas emisiones, renovaciones y recategorizaciones."
                        formula="Número de brevetes emitidos = Σ Brevetes otorgados en el periodo"
                        unit="Número de brevetes"
                        frequency="Mensual"
                        source="Sistema de tramite documentario"
                        responsible="Gerencia de Transporte y Movilidad Urbana"
                      />
                      <IndicatorModal
                        id="I07"
                        name="Número de intervenciones"
                        group="PERMISOS"
                        description="Mide la cantidad total de acciones de control, fiscalización o inspección realizadas sobre vehículos, operadores o rutas de transporte."
                        formula="Número de intervenciones = Σ Intervenciones ejecutadas en el periodo"
                        unit="Número de intervenciones"
                        frequency="Mensual"
                        source="Sistema de tramite documentario y Sistema de recaudación SATP"
                        responsible="Gerencia de Transporte y Movilidad Urbana"
                      />
                      <IndicatorModal
                        id="I09"
                        name="Número de empresas de taxi formalizadas"
                        group="PERMISOS"
                        description="Mide la cantidad de empresas de taxi que han cumplido con los requisitos legales y administrativos establecidos por la autoridad para operar formalmente."
                        formula="Número de empresas formalizadas = Σ empresas de taxi registradas y habilitadas en el periodo"
                        unit="Número de empresas"
                        frequency="Mensual"
                        source="Sistema de Tramite documentario y archivos manuales"
                        responsible="Gerencia de Transporte y Movilidad Urbana"
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
