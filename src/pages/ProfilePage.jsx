import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CheckCircle2, Package, Truck, Clock, ChevronRight, ChevronDown, ShoppingCart, Heart, BadgeCheck, User, RefreshCcw, LogOut } from "lucide-react";
import { useOrders } from "../context/useOrders";
import { useAuth } from "../context/AuthContext";
import { changePassword as apiChangePassword } from "../services/auth";

// Orders now come from OrderContext

const statusColors = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-amber-100 text-amber-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColors = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  paid: "bg-green-50 text-green-700 border border-green-200",
  refunded: "bg-blue-50 text-blue-700 border border-blue-200",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, wishlistItems } = useCart();
  const { orders, advanceOrderStatus, loaded, error: ordersError } = useOrders();
  const { user, logout, updateProfile } = useAuth();
  const [activeOrder, setActiveOrder] = useState(orders[0] || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState('overview'); // 'overview' | 'account' | 'edit' | 'returns'
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [emailError, setEmailError] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErr, setPwErr] = useState('');
  const [pwOk, setPwOk] = useState('');

  const fullName = (user?.firstName || user?.lastName)
    ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    : (user?.email?.split?.('@')?.[0] || 'User');
  const email = user?.email || 'user@example.com';
  const initials = ((user?.firstName?.[0] || user?.email?.[0] || 'U') + '').toUpperCase();

  const handleAdvanceStatus = (orderId) => {
    advanceOrderStatus(orderId);
  };

  // If there is no active order selected and orders arrive later, select the first one
  useEffect(() => {
    if (!activeOrder && orders && orders.length > 0) {
      setActiveOrder(orders[0]);
    }
  }, [orders]);

  // Sync section with query param (?tab=overview|account|edit)
  useEffect(() => {
    const usp = new URLSearchParams(location.search);
    const tab = usp.get('tab');
    if (tab === 'returns') {
      setSection('returns');
      setEditing(false);
    } else if (tab === 'edit') {
      setSection('edit');
      setEditing(true);
      // Initialize form from user
      setForm({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
      });
    } else if (tab === 'account') {
      setSection('account');
      setEditing(false);
    } else {
      setSection('overview');
      setEditing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, user?.firstName, user?.lastName, user?.email, user?.phone]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Show global orders loading state for overview tab when not yet loaded */}
      {!loaded && section==='overview' && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600 animate-pulse">Loading your orders...</div>
      )}
      {loaded && section==='overview' && orders.length===0 && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">You have no orders yet.</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 relative">
            <button
              type="button"
              onClick={()=>setMenuOpen(o=>!o)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-400 transition"
              aria-label={menuOpen ? 'Collapse menu' : 'Expand menu'}
            >
              {menuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <div className="flex items-center space-x-4 pr-10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                {initials}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  {fullName} <BadgeCheck className="w-5 h-5 text-blue-500" />
                </h2>
                <p className="text-sm text-gray-500 break-words">{email}</p>
                {user?.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
              </div>
            </div>
            <div className={`mt-6 space-y-2 text-sm ${menuOpen ? 'block' : 'hidden'} animate-fade-in`}>  
              <button onClick={()=>{ navigate('/profile?tab=account'); setSection('account'); setEditing(false); setMenuOpen(false); }} className={`flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 ${section==='account' ? 'bg-gray-50' : ''}`}>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Account Info</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>{navigate('/orders'); setMenuOpen(false);}} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Orders ({orders.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>{navigate('/wishlist'); setMenuOpen(false);}} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> Wishlist ({wishlistItems.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>{navigate('/cart'); setMenuOpen(false);}} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Cart ({cartItems.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>{ navigate('/return-policy'); setMenuOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Returns Policy</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={async ()=>{ await logout(); navigate('/'); setMenuOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600">
                <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <p className="text-xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-xs text-blue-700 font-medium">Orders</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <p className="text-xl font-bold text-green-600">{wishlistItems.length}</p>
                <p className="text-xs text-green-700 font-medium">Wishlist</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 col-span-2">
                <p className="text-xl font-bold text-indigo-600">৳ {orders.reduce((s,o)=>s+o.total,0)}</p>
                <p className="text-xs text-indigo-700 font-medium">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
          {(section==='edit' || editing) && (
            <>
            <div className="flex items-center justify-end">
              <button onClick={()=>{ setEditing(false); setSection('account'); navigate('/profile?tab=account'); }} className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50">Back to Account Info</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
              {err && <div className="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm">{err}</div>}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 font-medium">First name</label>
                  <input value={form.firstName} onChange={e=>setForm(f=>({...f, firstName: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 font-medium">Last name</label>
                  <input value={form.lastName} onChange={e=>setForm(f=>({...f, lastName: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-700 font-medium">Email</label>
                  <input type="email" value={form.email} onChange={e=>{ const v=e.target.value; setForm(f=>({...f, email: v})); setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'':'Invalid email'); }} className={`mt-1 w-full border rounded-lg px-3 py-2 ${emailError? 'border-red-400':''}`} />
                  {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-700 font-medium">Phone</label>
                  <input value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button disabled={saving || !!emailError} onClick={async ()=>{ setErr(''); setSaving(true); try { await updateProfile(form); setEditing(false); } catch(e){ setErr(e?.message||'Failed to update'); } finally { setSaving(false); } }} className="px-3 sm:px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50">{saving? 'Saving…':'Save changes'}</button>
                <button disabled={saving} onClick={()=>setEditing(false)} className="px-3 sm:px-4 py-2 rounded-lg border">Cancel</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            {pwErr && <div className="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm">{pwErr}</div>}
            {pwOk && <div className="mb-3 p-2 rounded bg-green-50 text-green-700 text-sm">{pwOk}</div>}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 font-medium">Current password</label>
                <input type="password" value={pwForm.currentPassword} onChange={e=>setPwForm(f=>({...f, currentPassword: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium">New password</label>
                <input type="password" value={pwForm.newPassword} onChange={e=>setPwForm(f=>({...f, newPassword: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium">Confirm new password</label>
                <input type="password" value={pwForm.confirm} onChange={e=>setPwForm(f=>({...f, confirm: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
            <div className="mt-4">
              <button disabled={pwSaving} onClick={async ()=>{
                setPwErr(''); setPwOk('');
                if (!pwForm.currentPassword || !pwForm.newPassword) { setPwErr('Please enter passwords'); return; }
                if (pwForm.newPassword.length < 6) { setPwErr('New password must be at least 6 characters'); return; }
                if (pwForm.newPassword !== pwForm.confirm) { setPwErr('Passwords do not match'); return; }
                setPwSaving(true);
                try {
                  await apiChangePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
                  setPwOk('Password updated');
                  setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
                } catch(e) {
                  setPwErr(e?.message || 'Failed to change password');
                } finally { setPwSaving(false); }
              }} className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50">{pwSaving? 'Saving…':'Change Password'}</button>
            </div>
          </div>
            </>
          )}
          {section==='account' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First name</p>
                  <p className="mt-1 font-medium text-gray-900">{user?.firstName || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last name</p>
                  <p className="mt-1 font-medium text-gray-900">{user?.lastName || '—'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 font-medium text-gray-900 break-words">{user?.email || '—'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="mt-1 font-medium text-gray-900">{user?.phone || '—'}</p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setForm({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                    });
                    setEditing(true);
                    setSection('edit');
                    navigate('/profile?tab=edit');
                  }}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
          {/* Active Order Tracking */}
          {section==='overview' && activeOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Order Tracking <Package className="w-5 h-5 text-gray-500" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Order ID: {activeOrder.id} • Placed on {activeOrder.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[activeOrder.status]}`}>{activeOrder.status}</span>
                  {activeOrder.paymentStatus && (
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${paymentColors[activeOrder.paymentStatus]}`}>{activeOrder.paymentStatus}</span>
                  )}
                  {activeOrder.status !== 'delivered' && (
                    <button onClick={()=>handleAdvanceStatus(activeOrder.id)} className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800">Advance Status</button>
                  )}
                </div>
              </div>

              {/* Tracking Steps (horizontal scroll on small screens) */}
              <div className="relative overflow-x-auto -mx-2 px-2">
                <div className="min-w-[520px]">
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-4">
                    {activeOrder.tracking.steps.map(step => (
                      <div key={step.key} className="flex-1 text-center">
                        <p className={step.key === activeOrder.tracking.current ? 'text-gray-900 font-semibold' : ''}>{step.label}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wide">{step.time || '—'}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    {activeOrder.tracking.steps.map(step => {
                      const index = activeOrder.tracking.steps.findIndex(s=>s.key===step.key);
                      const currentIndex = activeOrder.tracking.steps.findIndex(s=>s.key===activeOrder.tracking.current);
                      const completed = index <= currentIndex;
                      return (
                        <div key={step.key} className="flex-1 flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow ${completed ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gray-200 text-gray-500'}`}>{completed ? <CheckCircle2 className="w-5 h-5 text-white" /> : index+1}</div>
                          {index < activeOrder.tracking.steps.length -1 && (
                            <div className={`h-1 flex-1 mx-1 md:mx-2 rounded ${completed && index < currentIndex ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-200'}`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
                <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">Items ({activeOrder.items.length}) <Truck className="w-4 h-4 text-gray-500" /></h4>
                <div className="divide-y">
                  {activeOrder.items.map(it => (
                    <div key={it.id} className="py-3 flex items-center justify-between text-sm gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 line-clamp-2 sm:line-clamp-1 break-words">{it.title}</p>
                        <p className="text-xs text-gray-500">Qty: {it.qty}{it.selectedSize ? ` • Size: ${it.selectedSize}` : ''}</p>
                      </div>
                      <p className="font-semibold text-gray-900">৳ {it.price * it.qty}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>৳ {activeOrder.total}</span>
                </div>
              </div>
            </div>
          )}

          {/* Orders List */}
          {section==='overview' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">Recent Orders <Clock className="w-5 h-5 text-gray-500" /></h3>
              <button onClick={()=>navigate('/orders')} className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800">View All</button>
            </div>
            <div className="divide-y">
              {orders.map(o => (
                <button
                  key={o.id}
                  onClick={()=>setActiveOrder(o)}
                  className={`w-full text-left py-4 flex items-center justify-between gap-4 hover:bg-gray-50 rounded-lg px-2 transition ${activeOrder?.id === o.id ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{o.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.date}</p>
                  </div>
                  <div className="hidden md:block text-sm font-medium text-gray-700">৳ {o.total}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                    {o.paymentStatus && (
                      <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${paymentColors[o.paymentStatus]}`}>{o.paymentStatus}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
