import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Button from './components/ui/Button';
import { useState } from 'react';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/hero', label: 'Hero Section' },
  { to: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <span className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent select-none">Kidora Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `block px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              onClick={()=>setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Button variant="outline" className="w-full" onClick={()=>navigate('/')}>Return to Store</Button>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-md border border-gray-200 hover:bg-gray-50" onClick={()=>setSidebarOpen(o=>!o)}>
              <span className="sr-only">Toggle Menu</span>
              <div className="w-5 h-0.5 bg-gray-600 mb-1" />
              <div className="w-5 h-0.5 bg-gray-600 mb-1" />
              <div className="w-5 h-0.5 bg-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-semibold text-gray-900 leading-tight">Admin User</p>
              <p className="text-xs text-gray-500">admin@kidora.dev</p>
            </div>
            <Button variant="outline" className="hidden sm:inline-flex">Logout</Button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
