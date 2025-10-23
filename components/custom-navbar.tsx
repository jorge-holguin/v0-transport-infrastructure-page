import Image from "next/image"

export function CustomNavbar() {
  const logoBaseClasses = "h-20 sm:h-24 lg:h-28 w-auto object-contain max-w-[180px] sm:max-w-[200px] lg:max-w-[220px]"
  const containerBaseClasses = "flex items-center justify-center gap-6 sm:gap-10 lg:gap-12 flex-1 bg-white rounded-xl lg:rounded-2xl py-4 sm:py-5 px-8 sm:px-10 shadow-sm w-full lg:w-auto min-w-0 overflow-hidden max-w-full h-[140px] sm:h-[160px] lg:h-[180px]"

  return (
    <header className="bg-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-1 sm:py-2 bg-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 max-w-none min-w-0">
          {/* Primera columna - Logos institucionales */}
          <div className={containerBaseClasses}>
            <Image src="/images/navbar/logo-mtc.png" alt="Ministerio de Transportes y Comunicaciones" width={200} height={100} className={logoBaseClasses} />
            <Image src="/images/navbar/logo-promovilidad.png" alt="PROMOVILIDAD" width={200} height={100} className={logoBaseClasses} />
            <Image src="/images/navbar/logo-municipalidad-piura.png" alt="Municipalidad Provincial de Piura" width={200} height={100} className={logoBaseClasses} />
          </div>

          {/* Segunda columna - Cooperación */}
          <div className={containerBaseClasses}>
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <p className="text-sm sm:text-base text-gray-600 font-bold text-center leading-tight whitespace-nowrap">Con el apoyo de:</p>
              <Image src="/images/navbar/logo-cooperacion-alemana.jpeg" alt="Cooperación Alemana" width={120} height={60} className="h-16 sm:h-20 lg:h-24 w-auto object-contain max-w-[100px] sm:max-w-[120px] lg:max-w-[140px]" />
            </div>

            <Image src="/images/navbar/leyenda-cooperacion-alemana.jpeg" alt="Implementado por GIZ - Embajada de Suiza en el Perú" width={220} height={100} className="h-20 sm:h-24 lg:h-28 w-auto object-contain max-w-[200px] sm:max-w-[220px] lg:max-w-[240px]" />
          </div>
        </div>
      </div>

      <div className="bg-blue-500 h-1.5 w-full"></div>
    </header>
  )
}
