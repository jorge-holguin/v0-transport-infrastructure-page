"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Car, Building, ClipboardCheck, GraduationCap, ShieldAlert, TrendingUp } from "lucide-react"
import { GerenciaView } from "./GerenciaView"
import { SubgerenciaTransporteView } from "./SubgerenciaTransporteView"
import { SubgerenciaFiscalizacionView } from "./SubgerenciaFiscalizacionView"
import { SubgerenciaTransitoView } from "./SubgerenciaTransitoView"
import { SubgerenciaEducacionView } from "./SubgerenciaEducacionView"
import { ManualUsoPDF } from "@/components/shared/ManualUsoPDF"

type ViewType = 
  | "menu" 
  | "gerencia" 
  | "gerencia-recaudacion"
  | "transporte" 
  | "transporte-recaudacion"
  | "transporte-parque"
  | "fiscalizacion" 
  | "fiscalizacion-recaudacion"
  | "transito" 
  | "transito-recaudacion"
  | "transito-senalizacion"
  | "transito-permisos"
  | "educacion"
  | "educacion-capacitacion"
  | "educacion-seguridad"

interface TransporteIndicadoresProps {
  onBack: () => void
  selectedYear: string
  onYearChange: (year: string) => void
}

export function TransporteIndicadores({ onBack, selectedYear, onYearChange }: TransporteIndicadoresProps) {
  const [currentView, setCurrentView] = useState<ViewType>("menu")

  const handleBack = () => {
    switch (currentView) {
      case "menu":
        onBack()
        break
      case "gerencia":
      case "transporte":
      case "fiscalizacion":
      case "transito":
      case "educacion":
        setCurrentView("menu")
        break
      case "gerencia-recaudacion":
        setCurrentView("gerencia")
        break
      case "transporte-recaudacion":
      case "transporte-parque":
        setCurrentView("transporte")
        break
      case "fiscalizacion-recaudacion":
        setCurrentView("fiscalizacion")
        break
      case "transito-recaudacion":
      case "transito-senalizacion":
      case "transito-permisos":
        setCurrentView("transito")
        break
      case "educacion-capacitacion":
      case "educacion-seguridad":
        setCurrentView("educacion")
        break
      default:
        setCurrentView("menu")
    }
  }

  // Menu principal con organigrama
  if (currentView === "menu") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>

        {/* Fila 1: Gerencia (botón naranja centrado) */}
        <div className="flex justify-center">
          <Card
            className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer px-8 py-4"
            onClick={() => setCurrentView("gerencia")}
          >
            <div className="text-center text-white">
              <h3 className="font-bold text-lg">Gerencia de</h3>
              <h3 className="font-bold text-lg">Transporte y</h3>
              <h3 className="font-bold text-lg">Movilidad Urbana</h3>
            </div>
          </Card>
        </div>

        {/* Fila 2: 4 Subgerencias con colores distintos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="bg-cyan-600 hover:bg-cyan-700 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("transporte")}
          >
            <div className="p-4 text-center text-white">
              <h3 className="font-bold text-sm">SubGerencia</h3>
              <h3 className="font-bold text-sm">Transporte</h3>
            </div>
          </Card>

          <Card
            className="bg-green-500 hover:bg-green-600 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("fiscalizacion")}
          >
            <div className="p-4 text-center text-white">
              <h3 className="font-bold text-sm">SubGerencia</h3>
              <h3 className="font-bold text-sm">Fiscalización</h3>
            </div>
          </Card>

          <Card
            className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("transito")}
          >
            <div className="p-4 text-center text-white">
              <h3 className="font-bold text-sm">SubGerencia Tránsito</h3>
              <h3 className="font-bold text-sm">y Movilidad Urbana</h3>
            </div>
          </Card>

          <Card
            className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("educacion")}
          >
            <div className="p-4 text-center text-white">
              <h3 className="font-bold text-sm">SubGerencia</h3>
              <h3 className="font-bold text-sm">Educación y</h3>
              <h3 className="font-bold text-sm">Seguridad Vial</h3>
            </div>
          </Card>
        </div>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Gerencia - muestra card de Recaudación
  if (currentView === "gerencia") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
        
        {/* Botón de Gerencia (solo visual, indicador de ubicación) */}
        <div className="flex justify-center">
          <div className="bg-orange-500 px-8 py-4 rounded-lg">
            <div className="text-center text-white">
              <h3 className="font-bold text-lg">Gerencia de</h3>
              <h3 className="font-bold text-lg">Transporte y Movilidad Urbana</h3>
            </div>
          </div>
        </div>

        {/* Card de Recaudación */}
        <div className="flex justify-center">
          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-blue-50 hover:scale-105 transition-all duration-300 cursor-pointer group"
            onClick={() => setCurrentView("gerencia-recaudacion")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <CreditCard className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Recaudación</h3>
                <p className="text-sm text-gray-600">Montos totales recaudados por subgerencias</p>
              </div>
            </div>
          </Card>
        </div>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Recaudación de la Gerencia
  if (currentView === "gerencia-recaudacion") {
    return (
      <GerenciaView 
        onBack={handleBack} 
        selectedYear={selectedYear} 
        onYearChange={onYearChange} 
      />
    )
  }

  // Vista de Subgerencia de Transporte - muestra 2 cards
  if (currentView === "transporte") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
        
        {/* Indicador de ubicación */}
        <div className="flex justify-center">
          <div className="bg-cyan-600 px-8 py-4 rounded-lg">
            <div className="text-center text-white">
              <h3 className="font-bold text-lg">SubGerencia</h3>
              <h3 className="font-bold text-lg">Transporte</h3>
            </div>
          </div>
        </div>

        {/* Cards de opciones */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-blue-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("transporte-recaudacion")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <CreditCard className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Recaudación</h3>
                <p className="text-sm text-gray-600">Montos totales recaudados por subgerencias</p>
              </div>
            </div>
          </Card>

          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-purple-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("transporte-parque")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <Car className="w-12 h-12 text-purple-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Parque Automotor</h3>
                <h3 className="font-bold text-lg text-gray-900">Antigüedad</h3>
                <p className="text-sm text-gray-600">Análisis de antigüedad vehicular</p>
              </div>
            </div>
          </Card>
        </div>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Recaudación de Subgerencia de Transporte
  if (currentView === "transporte-recaudacion") {
    return (
      <SubgerenciaTransporteView 
        onBack={handleBack} 
        selectedYear={selectedYear} 
      />
    )
  }

  // Vista de Parque Automotor (sin contenido)
  if (currentView === "transporte-parque") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm p-8">
          <div className="text-center text-gray-500 py-12">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Contenido próximamente</p>
            <p className="text-sm">Esta sección está en desarrollo</p>
          </div>
        </Card>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Subgerencia de Fiscalización - muestra card de Recaudación
  if (currentView === "fiscalizacion") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
        
        {/* Indicador de ubicación */}
        <div className="flex justify-center">
          <div className="bg-green-500 px-8 py-4 rounded-lg">
            <div className="text-center text-white">
              <h3 className="font-bold text-lg">SubGerencia</h3>
              <h3 className="font-bold text-lg">Fiscalización</h3>
            </div>
          </div>
        </div>

        {/* Card de Recaudación */}
        <div className="flex justify-center">
          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-blue-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("fiscalizacion-recaudacion")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <CreditCard className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Recaudación</h3>
                <p className="text-sm text-gray-600">Montos totales recaudados por subgerencias</p>
              </div>
            </div>
          </Card>
        </div>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Recaudación de Subgerencia de Fiscalización
  if (currentView === "fiscalizacion-recaudacion") {
    return (
      <SubgerenciaFiscalizacionView 
        onBack={handleBack} 
        selectedYear={selectedYear} 
      />
    )
  }

  // Vista de Subgerencia de Tránsito - muestra 3 cards
  if (currentView === "transito") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
        
        {/* Indicador de ubicación */}
        <div className="flex justify-center">
          <div className="bg-purple-600 px-8 py-4 rounded-lg">
            <div className="text-center text-white">
              <h3 className="font-bold text-lg">SubGerencia Tránsito</h3>
              <h3 className="font-bold text-lg">y Movilidad Urbana</h3>
            </div>
          </div>
        </div>

        {/* Cards de opciones */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-blue-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("transito-recaudacion")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <CreditCard className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Recaudación</h3>
                <p className="text-sm text-gray-600">Montos totales recaudados por subgerencias</p>
              </div>
            </div>
          </Card>

          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("transito-senalizacion")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <Building className="w-12 h-12 text-orange-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Señalización</h3>
                <p className="text-sm text-gray-600">Tipos de señalización</p>
              </div>
            </div>
          </Card>

          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-gray-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("transito-permisos")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <ClipboardCheck className="w-12 h-12 text-gray-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Permisos</h3>
                <p className="text-sm text-gray-600">Autorizaciones municipales</p>
              </div>
            </div>
          </Card>
        </div>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Recaudación de Subgerencia de Tránsito
  if (currentView === "transito-recaudacion") {
    return (
      <SubgerenciaTransitoView 
        onBack={handleBack} 
        selectedYear={selectedYear}
        viewType="recaudacion"
      />
    )
  }

  // Vista de Señalización de Subgerencia de Tránsito
  if (currentView === "transito-senalizacion") {
    return (
      <SubgerenciaTransitoView 
        onBack={handleBack} 
        selectedYear={selectedYear}
        viewType="senalizacion"
      />
    )
  }

  // Vista de Permisos (sin contenido)
  if (currentView === "transito-permisos") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm p-8">
          <div className="text-center text-gray-500 py-12">
            <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Contenido próximamente</p>
            <p className="text-sm">Esta sección está en desarrollo</p>
          </div>
        </Card>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Subgerencia de Educación - muestra 2 cards
  if (currentView === "educacion") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
        
        {/* Indicador de ubicación */}
        <div className="flex justify-center">
          <div className="bg-red-500 px-8 py-4 rounded-lg">
            <div className="text-center text-white">
              <h3 className="font-bold text-lg">SubGerencia</h3>
              <h3 className="font-bold text-lg">Educación y</h3>
              <h3 className="font-bold text-lg">Seguridad Vial</h3>
            </div>
          </div>
        </div>

        {/* Cards de opciones */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-green-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("educacion-capacitacion")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <GraduationCap className="w-12 h-12 text-green-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Capacitación</h3>
                <p className="text-sm text-gray-600">Capacitaciones viales realizadas</p>
              </div>
            </div>
          </Card>

          <Card
            className="w-full max-w-xs bg-white/95 backdrop-blur-sm hover:bg-gray-50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setCurrentView("educacion-seguridad")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <ShieldAlert className="w-12 h-12 text-gray-600" />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Seguridad Vial</h3>
                <p className="text-sm text-gray-600">Registro de incidentes de seguridad vial</p>
              </div>
            </div>
          </Card>
        </div>

        <ManualUsoPDF />
      </div>
    )
  }

  // Vista de Capacitación
  if (currentView === "educacion-capacitacion") {
    return (
      <SubgerenciaEducacionView 
        onBack={handleBack} 
        selectedYear={selectedYear}
      />
    )
  }

  // Vista de Seguridad Vial (sin contenido)
  if (currentView === "educacion-seguridad") {
    return (
      <div className="space-y-6">
        {/* Botón Atrás en recuadro blanco */}
        <div className="flex justify-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm p-8">
          <div className="text-center text-gray-500 py-12">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Contenido próximamente</p>
            <p className="text-sm">Esta sección está en desarrollo</p>
          </div>
        </Card>

        <ManualUsoPDF />
      </div>
    )
  }

  return null
}
