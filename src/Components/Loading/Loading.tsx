export function Cargando() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-3">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
      <p className="text-blue-600 font-medium text-lg">
        Cargando...
      </p>
    </div>
  );
}
