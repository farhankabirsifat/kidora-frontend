import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await signup(form);
      navigate('/', { replace: true });
    } catch (e) { setError(e?.message || 'Signup failed'); } finally { setLoading(false); }
  };

  return (
    <div className="py-16">
      <div className="max-w-md mx-auto bg-white shadow rounded-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">Create your account</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-50 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">First name</label>
              <input name="firstName" className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last name</label>
              <input name="lastName" className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input name="phone" className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.password} onChange={handleChange} required />
          </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" name="confirmPassword" className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-300 focus:ring-red-400' : 'focus:ring-blue-500'}`} value={form.confirmPassword} onChange={handleChange} required />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                <div className="text-xs text-red-600 mt-1">Passwords do not match</div>
                )}
            </div>
            <button disabled={loading || (form.confirmPassword && form.password !== form.confirmPassword)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="text-sm text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
