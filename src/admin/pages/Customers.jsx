import { useEffect, useState, useMemo } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { listAdminUsers, updateUserRole } from '../../services/adminUsers';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Customers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(()=>{
    (async ()=>{
      setLoading(true); setError('');
      try {
        const data = await listAdminUsers();
        setUsers(Array.isArray(data)? data: []);
      } catch(e) {
        setError(e?.message || 'Failed to load users');
      } finally { setLoading(false); }
    })();
  },[]);

  const filtered = useMemo(()=>{
    return users.filter(u => {
      const matchesQ = !query || (u.email?.toLowerCase().includes(query.toLowerCase()) || (u.firstName+u.lastName).toLowerCase().includes(query.toLowerCase()));
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesQ && matchesRole;
    });
  },[users, query, roleFilter]);

  const changeRole = async (id, role) => {
    setUpdatingId(id);
    try {
      await updateUserRole(id, role);
      setUsers(prev => prev.map(u=>u.id===id? { ...u, role }: u));
    } catch(e) { alert(e?.message || 'Failed to update role'); } finally { setUpdatingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Customers Info.</h2>
        <div className="flex gap-3">
          <Input placeholder="Search email or name" value={query} onChange={e=>setQuery(e.target.value)} className="w-56" />
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="border rounded-md px-2 py-2 text-sm bg-white">
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="SUB_ADMIN">Sub Admin</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-[11px] font-semibold tracking-wide text-gray-600 bg-gray-50"> 
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading users…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No users found.</div>
          ) : filtered.map(u => (
            <div key={u.id} className="grid md:grid-cols-12 gap-4 px-4 py-4 text-sm items-center">
              <div className="md:col-span-1 font-medium text-gray-900">{u.id}</div>
              <div className="md:col-span-3 cursor-pointer" onClick={()=>navigate(`/kidora-admin/customers/${u.id}`)}>
                <p className="font-medium text-blue-600 hover:underline">{u.firstName || u.lastName ? `${u.firstName||''} ${u.lastName||''}`.trim() : '—'}</p>
                <p className="text-[11px] text-gray-500 md:hidden break-all">{u.email}</p>
              </div>
              <div className="md:col-span-3 hidden md:block break-all">{u.email}</div>
              <div className="md:col-span-2 break-all text-gray-700">{u.phone || '—'}</div>
              <div className="md:col-span-1">
                <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-1 rounded-full ${u.role==='ADMIN' ? 'bg-red-100 text-red-700': u.role==='SUB_ADMIN' ? 'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-700'}`}>{u.role}</span>
              </div>
              <div className="md:col-span-2 flex md:justify-end gap-2">
                {u.role === 'ADMIN' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-red-50 text-red-600 border border-red-200 select-none">
                    <Lock className="w-3.5 h-3.5" /> Admin Locked
                  </span>
                ) : (
                  ['USER','SUB_ADMIN'].map(r => (
                    <Button
                      key={r}
                      size="sm"
                      variant={u.role===r? 'solid':'outline'}
                      disabled={updatingId===u.id}
                      onClick={()=>changeRole(u.id, r)}
                      className="text-[11px] px-2 py-1"
                    >
                      {r.replace('_',' ')}
                    </Button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
