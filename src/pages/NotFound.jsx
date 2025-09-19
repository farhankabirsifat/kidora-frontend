import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();
  const originalPath = location.state && location.state.originalPath ? location.state.originalPath : location.pathname;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gray-50 text-center">
      <div className="max-w-md">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-6">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          The path <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs font-mono">{originalPath}</code> does not exist.
          It may have been removed, renamed, or you mistyped the address.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow">Go Home</Link>
        </div>
        <p className="mt-8 text-[11px] uppercase tracking-wide text-gray-400">Kidora Commerce Platform</p>
      </div>
    </div>
  );
}
