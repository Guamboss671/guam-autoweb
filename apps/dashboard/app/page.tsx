import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Guam AutoWeb</h1>
        <p className="text-gray-400 text-lg">Lead generation + website creation automation</p>
        <div className="flex gap-4 justify-center">
          <Link href="/leads" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
