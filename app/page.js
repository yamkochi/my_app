// Declaring that this file is using client-side rendering
"use client"

// This is the Home component, which serves as the home directory
export default function Home() {
  return (
    <div
      style={{
        backgroundImage: "url('/misc/bridge2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <h1>Home</h1>{" "}
      {/* Displaying the "Home" heading on the page (localhost:3000) */}
    </div>
  )
}
