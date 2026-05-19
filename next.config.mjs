// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  // Ensures Leaflet assets don't throw unexpected token errors during compilation
  transpilePackages: ["react-leaflet", "leaflet"],
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

export default nextConfig
