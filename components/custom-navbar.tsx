import Image from "next/image"

export function CustomNavbar() {
  const logoBaseClasses = "h-14 sm:h-16 md:h-18 lg:h-20 xl:h-24 w-auto object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px] xl:max-w-[200px]"
  const containerBaseClasses = "flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 flex-1 bg-white rounded-lg sm:rounded-xl md:rounded-2xl py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 shadow-sm w-full lg:w-auto min-w-0 overflow-hidden max-w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px]"

  return (
    <header className="bg-gray-200 shadow-sm">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-1 sm:py-2 bg-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 lg:gap-6 max-w-none min-w-0">
          {/* Primera columna - Logos institucionales */}
          <div className={containerBaseClasses}>
            <Image src="/images/navbar/logo-mtc.png" alt="Ministerio de Transportes y Comunicaciones" width={160} height={80} className={logoBaseClasses} />
            <Image src="/images/navbar/logo-promovilidad.png" alt="PROMOVILIDAD" width={160} height={80} className={logoBaseClasses} />
            <Image src="/images/navbar/logo-municipalidad-piura.png" alt="Municipalidad Provincial de Piura" width={160} height={80} className={logoBaseClasses} />
          </div>

          {/* Segunda columna - Cooperación */}
          <div className={containerBaseClasses}>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-bold text-center leading-tight whitespace-nowrap">Con el apoyo de:</p>
              <Image src="/images/navbar/logo-cooperacion-alemana.jpeg" alt="Cooperación Alemana" width={100} height={50} className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18 w-auto object-contain max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px]" />
            </div>

            <Image src="/images/navbar/leyenda-cooperacion-alemana.jpeg" alt="Implementado por GIZ - Embajada de Suiza en el Perú" width={180} height={80} className="h-14 sm:h-16 md:h-18 lg:h-20 xl:h-24 w-auto object-contain max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px]" />
          </div>
        </div>
      </div>

      <div className="bg-blue-500 h-1.5 w-full"></div>
    </header>
  )
}
