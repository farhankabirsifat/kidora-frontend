import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { getBasicCreds } from '../../services/auth';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });

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
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-gray-500">Loading…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="h-56 flex items-center justify-center text-sm text-gray-400">Chart Placeholder</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
