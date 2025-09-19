import { useMemo } from 'react';

/**
 * SalesOverviewChart
 * Lightweight inline SVG dual-line chart (sales & orders) with axes & legend.
 * Props:
 *  - data: [{ date: '2025-05-01', sales: number, orders: number }, ...]
 *  - accentA / accentB tailwind color tokens (e.g. 'emerald', 'orange')
 */
export default function SalesOverviewChart({ data = [], accentA = 'emerald', accentB = 'orange' }) {
  const parsed = useMemo(() => data.map(d => ({
    date: new Date(d.date),
    sales: Number(d.sales || 0),
    orders: Number(d.orders || 0)
  })).sort((a,b)=>a.date-b.date), [data]);

  const width = 740; // internal logical width
  const height = 260; // internal logical height
  const pad = { top: 10, right: 16, bottom: 36, left: 42 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const maxY = useMemo(() => {
    const m = Math.max(1, ...parsed.map(p => Math.max(p.sales, p.orders)));
    // round up to nice step
    const pow = Math.pow(10, Math.floor(Math.log10(m)));
    return Math.ceil(m / pow) * pow;
  }, [parsed]);

  const yTicks = 4;
  const buildPath = (key) => {
    if (!parsed.length) return '';
    return parsed.map((pt, i) => {
      const x = pad.left + (i / (parsed.length - 1 || 1)) * innerW;
      const y = pad.top + innerH - (pt[key] / maxY) * innerH;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  };

  const salesPath = buildPath('sales');
  const ordersPath = buildPath('orders');

  const formatMoney = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n).replace('$','');

  return (
    <div className="w-full">
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* Grid */}
          {[...Array(yTicks+1)].map((_,i)=> {
            const y = pad.top + (i / yTicks) * innerH;
            return (
              <line
                key={`grid-${i}`}
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                className="stroke-gray-200"
                strokeWidth={1}
              />
            );
          })}
          {/* Y labels */}
          {[...Array(yTicks+1)].map((_,i)=> {
            const val = maxY - (maxY / yTicks) * i;
            const y = pad.top + (i / yTicks) * innerH + 4;
            return (
              <text
                key={`ylabel-${i}`}
                x={8}
                y={y}
                fontSize={10}
                className="fill-gray-500 font-medium"
              >
                {val}
              </text>
            );
          })}
          {/* X labels */}
          {parsed.map((pt,i)=>{
            if (i % Math.ceil(parsed.length/8 || 1) !== 0) return null;
            const x = pad.left + (i / (parsed.length - 1 || 1)) * innerW;
            return <text key={i} x={x} y={height-8} fontSize={10} textAnchor="middle" className="fill-gray-500">{pt.date.getDate().toString().padStart(2,'0')} {pt.date.toLocaleString('en',{ month:'short'})}</text>;
          })}
          {/* Lines */}
          <path d={ordersPath} fill="none" strokeWidth={3} className={`stroke-${accentA}-500`} strokeLinecap="round" />
          <path d={salesPath} fill="none" strokeWidth={3} className={`stroke-${accentB}-500`} strokeLinecap="round" />
          {/* End dots */}
          {parsed.length>0 && (
            <>
              {['orders','sales'].map((k,idx)=>{
                const last = parsed[parsed.length-1];
                const x = pad.left + innerW; // last point x
                const val = last[k];
                const y = pad.top + innerH - (val / maxY) * innerH;
                const color = k==='orders'? `var(--tw-color-${accentA}-500, #10b981)` : `var(--tw-color-${accentB}-500, #f97316)`;
                return <circle key={k} cx={x} cy={y} r={5} fill={color} className="shadow" />;})}
            </>
          )}
        </svg>
      </div>
      <div className="flex items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full bg-${accentA}-500`}></span><span className="text-gray-600">Orders</span></div>
        <div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full bg-${accentB}-500`}></span><span className="text-gray-600">Sales</span></div>
      </div>
    </div>
  );
}
