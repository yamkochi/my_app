// src/app/page.js
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <main className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to Next.js
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A clean template featuring JavaScript and Tailwind CSS.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow transition-colors hover:bg-blue-700"
          >
            Refresh Home
          </Link>
        </div>
      </main>
    </div>
  )
}
