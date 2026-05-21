// app/overview/page.js
import Link from "next/link"

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-12 rounded-2xl shadow-xl mt-12 border border-gray-100">
        <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Platform Info
        </span>

        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-6">
          System Overview Dashboard
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          This system provides enterprise-grade identity controls mapping
          relational MySQL clusters to modular user sessions. It handles
          encrypted credentials via custom backend gateways and coordinates
          permission structures dynamically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              ⚡ Architecture Performance
            </h3>
            <p className="text-gray-600 text-base">
              Stateless session validation means rapid routing overhead matching
              sub-millisecond edge processes.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              🔒 Secure Authentication
            </h3>
            <p className="text-gray-600 text-base">
              Utilises underlying httpOnly secure layers that successfully block
              common script injection attack surfaces.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
        >
          &larr; Back to Main Interface
        </Link>
      </div>
    </main>
  )
}
