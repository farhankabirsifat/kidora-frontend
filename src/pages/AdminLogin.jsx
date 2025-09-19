import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdminEmail } from '../services/auth';

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login(email, password);
      if (!isAdminEmail(email)) throw new Error('Not an admin account');
      navigate('/kidora-admin', { replace: true });
    } catch (e) {
      setError(e?.message || 'Admin login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 border border-gray-100">
        <h1 className="text-xl font-bold mb-6">Admin Sign in</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-50 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Email</label>
            <input type="email" autoComplete="off" className="mt-1 w-full border rounded-lg px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" autoComplete="new-password" className="mt-1 w-full border rounded-lg px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button disabled={loading} className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black disabled:opacity-50">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}
