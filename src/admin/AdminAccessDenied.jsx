import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAccessDenied() {
  const navigate = useNavigate();
  useEffect(()=>{
    const t = setTimeout(()=>navigate('/'), 10000);
    return ()=>clearTimeout(t);
  },[navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">You don't have permission to access the Kidora Admin area. You will be redirected to the homepage automatically.</p>
        <button onClick={()=>navigate('/')} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">Go Home Now</button>
      </div>
    </div>
  );
}
