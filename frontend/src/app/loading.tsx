export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#456882] to-[#a5bfcc]">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div
          className="absolute inset-0 rounded-full border-4 border-white/20"
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-white"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
      </div>
      {/* Text */}
      <p
        className="text-white text-lg font-medium tracking-wide"
        style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
      >
        Memuat...
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
