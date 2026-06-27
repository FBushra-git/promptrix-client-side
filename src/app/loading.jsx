export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1a2e] text-white">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-[#967bb6]" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.3em] text-white/45">
          Loading Promptrix
        </p>
      </div>
    </main>
  );
}