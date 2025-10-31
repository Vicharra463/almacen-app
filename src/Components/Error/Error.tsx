export function Error() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-3">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
      <p className="text-red-600 font-semibold text-lg">
        Error al cargar los movimientos 😥
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Reintentar
      </button>
    </div>
  );
}
