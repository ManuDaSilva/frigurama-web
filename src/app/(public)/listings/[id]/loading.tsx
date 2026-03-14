export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto p-6 animate-pulse">
      <div className="h-7 w-2/3 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    </main>
  );
}
