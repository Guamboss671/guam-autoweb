import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-gray-700 text-gray-200',
  qualified: 'bg-blue-900 text-blue-200',
  building: 'bg-yellow-900 text-yellow-200',
  preview_ready: 'bg-purple-900 text-purple-200',
  contacted: 'bg-orange-900 text-orange-200',
  replied: 'bg-cyan-900 text-cyan-200',
  converted: 'bg-green-900 text-green-200',
  lost: 'bg-red-900 text-red-200',
};

export default async function LeadsPage() {
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('score', { ascending: false })
    .limit(100);

  const stats = {
    total: leads?.length ?? 0,
    qualified: leads?.filter(l => l.score >= 50).length ?? 0,
    contacted: leads?.filter(l => l.status === 'contacted').length ?? 0,
    converted: leads?.filter(l => l.status === 'converted').length ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Leads</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-gray-900 rounded-xl p-4">
              <p className="text-gray-400 text-sm capitalize">{key}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="text-left p-4">Business</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Score</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{lead.business_name}</p>
                    <p className="text-gray-500 text-xs">{lead.address}</p>
                  </td>
                  <td className="p-4 text-gray-400">{lead.category}</td>
                  <td className="p-4">
                    <p className="text-gray-300">{lead.email ?? '—'}</p>
                    <p className="text-gray-500 text-xs">{lead.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${lead.score >= 70 ? 'text-green-400' : lead.score >= 40 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] ?? 'bg-gray-700'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{lead.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
