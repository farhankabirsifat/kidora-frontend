import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminPaymentConfig, updateAdminPaymentConfig } from '../../services/paymentConfig';

export default function PaymentConfig() {
  const { user, isAdmin } = useAuth();
  const [form, setForm] = useState({ bkashNumber: '', nagadNumber: '', rocketNumber: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(()=>{
    let mounted = true;
    // Wait until we know user context; if not admin show unauthorized.
    if(!isAdmin) { setUnauthorized(true); setLoading(false); return; }
    (async ()=>{
      try {
        const data = await getAdminPaymentConfig();
        if(mounted) setForm({
          bkashNumber: data.bkashNumber || '',
          nagadNumber: data.nagadNumber || '',
          rocketNumber: data.rocketNumber || ''
        });
      } catch(e){
        if(e.status === 401 || e.status === 403) {
          setUnauthorized(true);
        } else {
          setMessage(e.message || 'Failed to load config');
        }
      } finally { if(mounted) setLoading(false); }
    })();
    return ()=>{ mounted = false; };
  },[isAdmin, user?.email]);

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setForm(prev=>({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setSaving(true); setMessage(null);
    try {
      const res = await updateAdminPaymentConfig(form);
      setMessage('Updated successfully');
      setForm({
        bkashNumber: res.bkashNumber || '',
        nagadNumber: res.nagadNumber || '',
        rocketNumber: res.rocketNumber || ''
      });
    } catch(e){
      if(e.status === 401 || e.status === 403) setUnauthorized(true);
      setMessage(e.message || 'Update failed');
    } finally { setSaving(false); }
  };

  if(loading) return <div>Loading payment config...</div>;
  if(unauthorized) return <div className="text-sm text-red-600">Unauthorized: Admin credentials required.</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Payment Numbers</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">bKash Number</label>
          <input name="bkashNumber" value={form.bkashNumber} onChange={handleChange} placeholder="01xxxxxxxxx" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nagad Number</label>
          <input name="nagadNumber" value={form.nagadNumber} onChange={handleChange} placeholder="01xxxxxxxxx" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rocket Number</label>
          <input name="rocketNumber" value={form.rocketNumber} onChange={handleChange} placeholder="01xxxxxxxxx" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300" />
        </div>
        {message && <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded px-3 py-2">{message}</div>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
