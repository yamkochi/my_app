export default function Spinner({ size = "40px", color = "#4f46e5" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "4px solid #f3f4f6",
          borderTop: `4px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
