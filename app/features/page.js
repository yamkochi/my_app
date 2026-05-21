// app/features/page.js
import Link from "next/link"

export default function FeaturesPage() {
  const corporateFeatures = [
    {
      title: "Stateless Security Checkpoints",
      desc: "Cookies automatically monitor permissions securely on the server side.",
    },
    {
      title: "Dynamic Navbar States",
      desc: "Hides admin options cleanly depending on the database binary flag value.",
    },
    {
      title: "Next.js Route Interceptors",
      desc: "Blocks users from entering internal paths via manual browser address manipulations.",
    },
    {
      title: "MySQL Pool Interconnectivity",
      desc: "Leverages pooled connections to handle high volume authentication requests.",
    },
  ]

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-12 rounded-2xl shadow-xl mt-12 border border-gray-100">
        <span className="text-sm font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">
          Capabilities
        </span>

        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-6">
          System Core Features
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          The environment uses specific core parameters to control modular
          structural access for employees.
        </p>

        <div className="space-y-4 mb-8">
          {corporateFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-start p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
            >
              <span className="flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full w-8 h-8 mr-4 shrink-0 text-sm">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  {feat.title}
                </h4>
                <p className="text-gray-600 mt-1 text-base">{feat.desc}</p>
              </div>
            </div>
          ))}
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
