import React, { useState, useMemo } from 'react';
import { bdDistricts } from '../data/bdDistricts';
import { Link } from 'react-router-dom';

export default function DistrictsPage() {
  const [q, setQ] = useState('');
  const filtered = useMemo(()=> bdDistricts.filter(d=> d.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Bangladesh Districts ({filtered.length})</h1>
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <input
            type="text"
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Search district..."
            className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link to="/checkout" className="text-sm text-blue-600 hover:underline whitespace-nowrap">Go to Checkout →</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(d => (
          <div key={d} className="border rounded-lg px-4 py-3 bg-white shadow-sm text-gray-800 text-sm flex items-center justify-between">
            <span>{d}</span>
            <span className="text-[10px] font-medium text-gray-500 uppercase">District</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-sm text-gray-500 py-6 text-center border rounded-lg bg-white">No districts match your search.</div>
        )}
      </div>
      <p className="mt-8 text-xs text-gray-500 leading-relaxed">Select your district on the checkout page. This standalone page is just a reference list; you can enhance it later with search or mapping (e.g., divisions).</p>
    </div>
  );
}
