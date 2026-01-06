import Image from "next/image"

export function CustomNavbar() {
  return (
    <header className="bg-gray-200 shadow-sm">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 bg-gray-200 overflow-hidden">
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl py-6 sm:py-7 md:py-8 px-4 sm:px-5 md:px-6 shadow-sm flex justify-center w-full">
          <Image
            src="/images/navbar/logo-municipalidad-piura.png"
            alt="Municipalidad Provincial de Piura"
            width={160}
            height={80}
            className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]"
          />
        </div>
      </div>

      <div className="bg-blue-500 h-1.5 w-full"></div>
    </header>
  )
}
