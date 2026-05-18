"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ProjectMap = dynamic(() => import("../components/ProjectMap"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-slate-300 border-t-rose-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-slate-600">
        Connecting to database...
      </p>
    </div>
  ),
})

export default function MapPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjectPoints() {
      try {
        const response = await fetch("http://localhost:3000/api/projects/map")
        if (!response.ok) throw new Error("Network error")
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error("Error loading dynamic markers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjectPoints()
  }, [])

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-600">
          Rendering tracking layers...
        </p>
      </div>
    )
  }

  return <ProjectMap projects={projects} />
}
