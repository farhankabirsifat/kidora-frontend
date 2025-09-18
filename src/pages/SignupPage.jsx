import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        <div className="pb-6 flex justify-center">
          <Link to="/" aria-label="Go to homepage">
            <img src="/Kidora-logo.png" alt="Kidora" className="h-18 cursor-pointer" />
          </Link>
        </div>
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                className="mt-1 w-full border rounded-lg pr-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onMouseDown={(e)=>e.preventDefault()}
                onClick={()=>setShowPassword(v=>!v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.54-1.26 1.3-2.44 2.24-3.5" />
                    <path d="M22.73 12C21 16.11 16.73 20 12 20a10.94 10.94 0 0 1-5.94-2.06" />
                    <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                className={`mt-1 w-full border rounded-lg pr-10 px-3 py-2 focus:outline-none focus:ring-2 ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-300 focus:ring-red-400' : 'focus:ring-blue-500'}`}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                onMouseDown={(e)=>e.preventDefault()}
                onClick={()=>setShowConfirmPassword(v=>!v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.54-1.26 1.3-2.44 2.24-3.5" />
                    <path d="M22.73 12C21 16.11 16.73 20 12 20a10.94 10.94 0 0 1-5.94-2.06" />
                    <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
