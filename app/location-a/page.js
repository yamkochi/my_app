// Example using React-Leaflet
"use client"

// import dynamic from 'next/dynamic';

// const Map = dynamic(
//   () => import('@/app/components/Map/Map'), // path to your component
//   {
//     ssr: false, // This is the magic line
//     loading: () => <p>Loading Map...</p>
//   }
// );

import MyMap from "../components/Map/Map"

export default function Home() {
  return (
    <div>
      <MyMap />
      <h1>Home</h1>
    </div>
  )
}
