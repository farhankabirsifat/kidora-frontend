import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../services/auth';
import PasswordField from '../components/PasswordField';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=request, 2=verify
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRequest(e) {
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      await requestPasswordReset(email);
      setMessage('If that email exists, we sent a code.');
      setStep(2);
    } catch (e) {
      setError(e?.message || 'Request failed');
    } finally { setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      await resetPassword({ email, code, newPassword });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(()=>navigate('/login'), 1800);
    } catch (e) {
      setError(e?.message || 'Reset failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="py-16">
      <div className="max-w-sm mx-auto bg-white shadow rounded-2xl p-8 border border-gray-100">
        <div className="pb-6 flex justify-center">
          <Link to="/" aria-label="Go to homepage">
            <img src="/Kidora-logo.png" alt="Kidora" className="h-18 cursor-pointer" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        {message && <div className="mb-4 p-3 rounded bg-emerald-50 text-sm text-emerald-700">{message}</div>}
        {error && <div className="mb-4 p-3 rounded bg-red-50 text-sm text-red-700">{error}</div>}
        {step === 1 && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Sending…' : 'Send Code'}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input type="text" maxLength={6} className="mt-1 w-full border rounded-lg px-3 py-2 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500" value={code} onChange={e=>setCode(e.target.value.replace(/[^0-9]/g,''))} required />
            </div>
            <PasswordField label="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Resetting…' : 'Reset Password'}</button>
            <button type="button" onClick={()=>setStep(1)} className="w-full text-xs text-gray-500 hover:text-gray-700">Back</button>
          </form>
        )}
        <p className="text-sm text-gray-600 mt-4">Remembered? <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link></p>
      </div>
    </div>
  );
}
