import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Dashboard() {
  const stats = [
    { label: 'Total Orders', value: 1284, change: '+12% this week', color: 'blue' },
    { label: 'Pending Orders', value: 47, change: '-5% this week', color: 'amber' },
    { label: 'Revenue (৳)', value: '4,56,320', change: '+8% this week', color: 'emerald' },
    { label: 'Products In Stock', value: 312, change: '+3 new', color: 'indigo' },
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
          <div className="h-56 flex items-center justify-center text-sm text-gray-400">Chart Placeholder</div>
        </CardContent>
      </Card>
    </div>
  );
}
