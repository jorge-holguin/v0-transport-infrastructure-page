"use client"

import { FileText } from "lucide-react"

interface ManualUsoPDFProps {
  pdfUrl?: string
}

export function ManualUsoPDF({ pdfUrl = "/documents/manual-uso.pdf" }: ManualUsoPDFProps) {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg px-4 py-3 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
      >
        <div className="bg-red-500 p-2 rounded-lg group-hover:bg-red-600 transition-colors">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">Manual de Uso</span>
          <span className="text-xs text-gray-500">Descargar PDF</span>
        </div>
      </a>
    </div>
  )
}
