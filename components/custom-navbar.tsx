import Image from "next/image"

export function CustomNavbar() {
  return (
    <header className="bg-gray-200 shadow-sm">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 bg-gray-200 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 items-center justify-items-center bg-white rounded-lg sm:rounded-xl md:rounded-2xl py-6 sm:py-7 md:py-8 px-4 sm:px-5 md:px-6 shadow-sm w-full h-auto">
          <Image src="/images/navbar/logo-mtc.png" alt="Ministerio de Transportes y Comunicaciones" width={160} height={80} className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]" />
          <Image src="/images/navbar/logo-promovilidad.png" alt="PROMOVILIDAD" width={160} height={80} className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]" />
          <Image src="/images/navbar/logo-municipalidad-piura.png" alt="Municipalidad Provincial de Piura" width={160} height={80} className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]" />

          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-bold text-center leading-tight whitespace-nowrap">Con el apoyo de:</p>
            <Image src="/images/navbar/logo-cooperacion-alemana.jpeg" alt="Cooperación Alemana" width={100} height={50} className="h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 w-auto object-contain max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[160px] xl:max-w-[180px]" />
          </div>

          <Image src="/images/navbar/leyenda-cooperacion-alemana.jpeg" alt="Implementado por GIZ - Embajada de Suiza en el Perú" width={180} height={80} className="h-14 sm:h-16 md:h-18 lg:h-20 xl:h-22 w-auto object-contain max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] xl:max-w-[240px]" />
        </div>
      </div>

      <div className="bg-blue-500 h-1.5 w-full"></div>
    </header>
  )
}
