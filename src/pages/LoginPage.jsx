import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordField from '../components/PasswordField';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = new URLSearchParams(location.search).get('from') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="py-16">
      <div className="max-w-sm mx-auto bg-white shadow rounded-2xl p-8 border border-gray-100">
        <div className="pb-6 flex justify-center">
          <Link to="/" aria-label="Go to homepage">
            <img src="/Kidora-logo.png" alt="Kidora" className="h-18 cursor-pointer" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-50 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" placeholder="you@example.com" className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <PasswordField label="Password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="text-sm text-gray-600 mt-4">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Create one</Link></p>
      </div>
    </div>
  );
}
