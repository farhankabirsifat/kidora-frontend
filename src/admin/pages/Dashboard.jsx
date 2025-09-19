import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '../../services/apiClient';
import { getBasicCreds } from '../../services/auth';
import SalesOverviewChart from '../components/SalesOverviewChart';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [month, setMonth] = useState(() => new Date().getMonth()); // 0-11
  const [series, setSeries] = useState([]); // daily data for selected month

  // Fake generator (replace with backend endpoint later)
  useEffect(() => {
    // Build date list for selected month (use current year)
    const year = new Date().getFullYear();
    const days = new Date(year, month + 1, 0).getDate();
    const arr = Array.from({ length: days }).map((_, idx) => {
      const date = new Date(year, month, idx + 1);
      // Mock wave pattern
      const base = 60 + Math.sin(idx / 2.8) * 8 + (Math.random() * 3 - 1.5);
      const orders = Math.max(10, Math.round(base));
      const sales = Math.round(orders * (35 + (Math.sin(idx / 3.4) * 5) + 10));
      return { date: date.toISOString().slice(0,10), orders, sales };
    });
    setSeries(arr);
  }, [month]);

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }).map((_,i)=>({ value: i, label: new Date(2000, i, 1).toLocaleString('en',{ month:'long'}) }));
  }, []);

  const growth = useMemo(() => {
    if (series.length < 2) return 0;
    const firstWeek = series.slice(0,7).reduce((s,d)=>s+d.sales,0) || 1;
    const lastWeek = series.slice(-7).reduce((s,d)=>s+d.sales,0);
    return ((lastWeek - firstWeek) / firstWeek) * 100;
  }, [series]);

  useEffect(() => {
    (async () => {
      setError(''); setLoading(true);
      try {
        const basic = getBasicCreds();
        const data = await apiClient.get('/api/admin/dashboard/overview', { auth: { basic } });
        setOverview(data);
      } catch (e) {
        setError(e?.message || 'Failed to load overview');
      } finally { setLoading(false); }
    })();
  }, []);

  const stats = [
    { label: 'Total Orders', value: overview.orders, change: '', color: 'blue' },
    { label: 'Users', value: overview.users, change: '', color: 'amber' },
    { label: 'Revenue (৳)', value: overview.revenue, change: '', color: 'emerald' },
    { label: 'Products', value: overview.products, change: '', color: 'indigo' },
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{s.value}</p>
              <p className="text-xs mt-2 font-medium text-gray-500">{s.change}</p>
            </CardContent>
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${s.color}-500`} />
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl">Sales Overview</CardTitle>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-semibold tracking-tight">${overview.revenue?.toLocaleString?.() || '0'}</span>
              <span className={`text-sm font-medium ${growth>=0 ? 'text-emerald-600' : 'text-red-600'}`}>{growth>=0 ? '↑' : '↓'} {growth.toFixed(2)}%</span>
            </div>
          </div>
          <div>
            <select value={month} onChange={e=>setMonth(Number(e.target.value))} className="border rounded-lg px-3 py-2 text-sm bg-white">
              {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-gray-500">Loading…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="-ml-2 md:ml-0">
              <SalesOverviewChart data={series} accentA="emerald" accentB="orange" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
