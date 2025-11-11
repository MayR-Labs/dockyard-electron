export function EmptyState({ icon, title, message }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
