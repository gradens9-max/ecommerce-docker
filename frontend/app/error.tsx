"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Algo salió mal</h2>
      <p className="my-2 text-sm opacity-70">{error.message}</p>
      <button
        onClick={reset}
        className="rounded bg-blue-600 px-3 py-1 text-white"
      >
        Reintentar
      </button>
    </div>
  );
}