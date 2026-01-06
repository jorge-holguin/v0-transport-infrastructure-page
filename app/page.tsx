"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Bus, ShieldCheck } from "lucide-react"
import { CustomNavbar } from "@/components/custom-navbar"
import { TransporteIndicadores } from "@/components/transporte"

type MainCategory = null | "transporte" | "seguridad"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>(null)
  const [selectedYear, setSelectedYear] = useState("2024")

  // Título dinámico según la categoría seleccionada
  const getSectionTitle = () => {
    switch (selectedCategory) {
      case "transporte":
        return "INDICADORES DE TRANSPORTE"
      case "seguridad":
        return "INDICADORES DE SEGURIDAD CIUDADANA"
      default:
        return null
    }
  }

  const sectionTitle = getSectionTitle()

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
            <h1 className="mt-3 text-4xl md:text-5xl font-bold drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]">
              PLATAFORMA DE DATOS
            </h1>
            {sectionTitle && (
              <p className="mt-3 text-xl md:text-2xl font-bold text-red-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                {sectionTitle}
              </p>
            )}
          </div>

          <div className="max-w-6xl mx-auto">
            {!selectedCategory ? (
              // Main Category Selection - 2 Categories
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
                <Card
                  className="w-full bg-white/95 backdrop-blur-sm hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg"
                  onClick={() => setSelectedCategory("transporte")}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <Bus className="w-16 h-16 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-gray-800 transition-colors">
                        Transporte
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        Indicadores
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="w-full bg-white/95 backdrop-blur-sm hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg"
                  onClick={() => setSelectedCategory("seguridad")}
                >
                  <div className="p-8 flex flex-col items-center text-center gap-4">
                    <ShieldCheck className="w-16 h-16 text-green-600 group-hover:text-green-700 transition-colors" />
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-gray-800 transition-colors">
                        Seguridad
                      </h3>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-gray-800 transition-colors">
                        Ciudadana
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        Indicadores
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : selectedCategory === "transporte" ? (
              // Transporte Indicadores
              <TransporteIndicadores
                onBack={() => setSelectedCategory(null)}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            ) : (
              // Seguridad Ciudadana Indicadores - Por implementar
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-white hover:text-gray-200 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                  </svg>
                  Atrás
                </button>

                <Card className="bg-white/95 backdrop-blur-sm p-8">
                  <div className="text-center text-gray-500 py-12">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Seguridad Ciudadana Indicadores</p>
                    <p className="text-sm">Esta sección está en desarrollo</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Links flotantes en la parte inferior */}
        {!selectedCategory && (
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <a
              href="#"
              className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg px-4 py-3 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Estrategia de Datos</span>
                <span className="text-xs text-gray-500">Ver documento</span>
              </div>
            </a>
            <a
              href="#"
              className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg px-4 py-3 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">RA de Comité de Datos</span>
                <span className="text-xs text-gray-500">Ver documento</span>
              </div>
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
