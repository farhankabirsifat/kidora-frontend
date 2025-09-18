import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useOrders } from '../../context/useOrders';
import { listAdminOrders, updateOrderStatus, updatePaymentStatus } from '../../services/orders';

// Remove demo orders in production
const initialOrders = [];

const statusFlow = ['pending','processing','packed','shipped','out_for_delivery','delivered'];
const statusOptions = ['pending','processing','packed','shipped','out_for_delivery','delivered','cancelled'];
const paymentOptions = ['pending','paid','refunded'];
const uiToBackendStatus = {
  pending: 'PENDING',
  processing: 'CONFIRMED',
  packed: 'PACKED',
  out_for_delivery: 'OUT_FOR_DELIVERY',
  shipped: 'SHIPPED',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED',
};
const backendToUiStatus = {
  PENDING: 'pending',
  CONFIRMED: 'processing',
  PACKED: 'packed',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export default function Orders() {
  const { orders: userOrders, advanceOrderStatus } = useOrders();
  const [orders, setOrders] = useState(initialOrders); // no demo orders
  const [backendOrders, setBackendOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const data = await listAdminOrders({ page, size });
        const normalized = data.map(o => ({
          id: `#${o.id}`,
          backendId: o.id,
          createdAt: o.createdAt || null,
          customer: o.shippingAddress?.name || 'Customer',
          phone: o.shippingAddress?.phone || '',
          address: `${o.shippingAddress?.street || ''}, ${o.shippingAddress?.city || ''}`.trim(),
          total: o.totalAmount,
          method: o.paymentMethod?.toLowerCase?.() || 'cod',
          paymentProvider: o.paymentProvider || null,
          senderNumber: o.senderNumber || null,
          transactionId: o.transactionId || null,
          status: backendToUiStatus[o.status] || (o.status || 'PENDING').toLowerCase(),
          paymentStatus: (o.paymentStatus || 'PENDING').toLowerCase(),
          items: (o.items || []).map(i => ({ id: i.id, title: `#${i.productId}`, qty: i.quantity, price: i.price, selectedSize: i.selectedSize })),
          source: 'backend',
        }));
        setBackendOrders(normalized);
        setHasMore((data?.length || 0) === size);
      } catch (e) {
        setError(e?.message || 'Failed to load orders');
      } finally { setLoading(false); }
    })();
  }, [page, size]);

  // Normalize user orders from context so they display in admin list
  const normalizedUserOrders = useMemo(()=>
    userOrders.map(o => ({
      // Ensure id is a string for safe comparisons/sorting
      id: `#${o.id}`,
      customer: o.shipping?.name || 'Customer',
      phone: o.shipping?.phone || '',
      address: o.shipping?.address || '',
      total: o.total,
      // Normalize method/status to lowercase strings
      method: o.payment?.method?.toLowerCase?.() || 'cod',
      senderNumber: o.payment?.senderNumber || null,
      transactionId: o.payment?.transactionId || null,
      status: (o.tracking?.current === 'delivered' || o.status === 'delivered')
        ? 'delivered'
        : (o.tracking?.current || o.status || 'processing')?.toLowerCase?.() || 'processing',
      items: o.items || [],
      source: 'user'
    })),
    [userOrders]
  );

  // Prefer backend orders; only include user/local copies if no backend entry exists for that ID
  const combined = useMemo(() => {
    const map = new Map();
    // Use string ID as key (already formatted with '#')
    backendOrders.forEach(o => map.set(String(o.id), o));
    normalizedUserOrders.forEach(o => { if (!map.has(String(o.id))) map.set(String(o.id), o); });
    orders.forEach(o => { if (!map.has(String(o.id))) map.set(String(o.id), o); });
    return Array.from(map.values());
  }, [backendOrders, normalizedUserOrders, orders]);

  const applySort = (list) => {
    const sorted = [...list];
    sorted.sort((a,b)=>{
      if(sortKey==='total') return sortDir==='asc'? a.total - b.total : b.total - a.total;
      if(sortKey==='status') return sortDir==='asc'? a.status.localeCompare(b.status): b.status.localeCompare(a.status);
      // Fallback: compare IDs as strings to avoid errors when ids are numbers
      const aId = String(a.id);
      const bId = String(b.id);
      return sortDir==='asc'? aId.localeCompare(bId): bId.localeCompare(aId);
    });
    return sorted;
  };

  const filtered = applySort(combined.filter(o => {
    const q = (query || '').toLowerCase();
    const idStr = String(o.id || '').toLowerCase();
    const custStr = String(o.customer || '').toLowerCase();
    const statusStr = String(o.status || '');
    const methodStr = String(o.method || '');
    return (
      (idStr.includes(q) || custStr.includes(q)) &&
      (!statusFilter || statusStr === statusFilter) &&
      (!methodFilter || methodStr === methodFilter)
    );
  }));

  // Removed Next button handler per request

  const setStatusExplicit = async (o, uiStatus) => {
    if(o.source !== 'backend') return;
    const backend = uiToBackendStatus[uiStatus] || 'PENDING';
    try {
      const updated = await updateOrderStatus(o.backendId, backend);
      const mapped = {
        id: `#${updated.id}`,
        backendId: updated.id,
        createdAt: updated.createdAt || null,
        customer: updated.shippingAddress?.name || 'Customer',
        phone: updated.shippingAddress?.phone || '',
        address: `${updated.shippingAddress?.street || ''}, ${updated.shippingAddress?.city || ''}`.trim(),
        total: updated.totalAmount,
        method: updated.paymentMethod?.toLowerCase?.() || 'cod',
        paymentProvider: updated.paymentProvider || null,
        senderNumber: updated.senderNumber || null,
        transactionId: updated.transactionId || null,
        status: backendToUiStatus[updated.status] || (updated.status || 'PENDING').toLowerCase(),
        paymentStatus: (updated.paymentStatus || 'PENDING').toLowerCase(),
        items: (updated.items || []).map(i => ({ id: i.id, title: `#${i.productId}`, qty: i.quantity, price: i.price, selectedSize: i.selectedSize })),
        source: 'backend',
      };
      setBackendOrders(prev => prev.map(ord => ord.backendId===o.backendId? mapped : ord));
      setSelected(s => s && s.backendId===o.backendId? mapped : s);
    } catch(e) {
      setError(e?.message || 'Failed to update status');
    }
  };

  const setPaymentExplicit = async (o, uiPayment) => {
    if(o.source !== 'backend') return;
    const backend = (uiPayment || 'pending').toUpperCase();
    try {
      const updated = await updatePaymentStatus(o.backendId, backend);
      const mapped = {
        id: `#${updated.id}`,
        backendId: updated.id,
        createdAt: updated.createdAt || null,
        customer: updated.shippingAddress?.name || 'Customer',
        phone: updated.shippingAddress?.phone || '',
        address: `${updated.shippingAddress?.street || ''}, ${updated.shippingAddress?.city || ''}`.trim(),
        total: updated.totalAmount,
        method: updated.paymentMethod?.toLowerCase?.() || 'cod',
        paymentProvider: updated.paymentProvider || null,
        senderNumber: updated.senderNumber || null,
        transactionId: updated.transactionId || null,
        status: backendToUiStatus[updated.status] || (updated.status || 'PENDING').toLowerCase(),
        paymentStatus: (updated.paymentStatus || 'PENDING').toLowerCase(),
        items: (updated.items || []).map(i => ({ id: i.id, title: `#${i.productId}`, qty: i.quantity, price: i.price, selectedSize: i.selectedSize })),
        source: 'backend',
      };
      setBackendOrders(prev => prev.map(ord => ord.backendId===o.backendId? mapped : ord));
      setSelected(s => s && s.backendId===o.backendId? mapped : s);
    } catch(e) {
      setError(e?.message || 'Failed to update payment');
    }
  };

  const printInvoice = (o) => {
    if (!o) return;
    const fmt = (n) => `৳ ${Number(n || 0).toFixed(0)}`;
    const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString() : new Date().toLocaleString();
    const rows = (o.items || []).map(it => `
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb">${it.title || ''}${it.selectedSize ? ` (Size: ${it.selectedSize})` : ''}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${it.qty}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${fmt(it.price)}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${fmt((it.price||0)*(it.qty||0))}</td>
      </tr>`).join('');
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>Invoice ${o.id}</title>
      <style>
        @media print { .no-print { display: none; } }
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#111827; }
        .container { max-width: 800px; margin: 20px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; }
        h1 { font-size: 20px; margin: 0 0 4px; }
        .muted { color:#6b7280; font-size:12px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        table { width:100%; border-collapse: collapse; margin-top: 16px; }
        th { background:#f9fafb; text-align:left; padding:8px; border:1px solid #e5e7eb; font-weight:600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
          <div>
            <h1>Kidora - Invoice</h1>
            <div class="muted">Order ${o.id}</div>
            <div class="muted">Date: ${dateStr}</div>
          </div>
          <div style="text-align:right">
            <div><strong>Total:</strong> ${fmt(o.total)}</div>
            <div class="muted">Status: ${o.status}</div>
            <div class="muted">Payment: ${o.paymentStatus || '-'}</div>
          </div>
        </div>
        <div class="grid">
          <div>
            <div style="font-weight:600;margin-top:8px">Customer Details</div>
            <div>${o.customer || ''}</div>
            <div class="muted">${o.phone || ''}</div>
            <div class="muted">${o.address || ''}</div>
          </div>
          <div>
            <div style="font-weight:600;margin-top:8px">Payment</div>
            <div>Method: ${o.method === 'online' ? 'Online' : 'Cash on Delivery'}</div>
            ${o.method === 'online' ? `<div>Provider: ${o.paymentProvider || '-'}</div>` : ''}
            ${o.method === 'online' ? `<div>Sender: ${o.senderNumber || '-'}</div>` : ''}
            ${o.method === 'online' ? `<div>Transaction ID: ${o.transactionId || '-'}</div>` : ''}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align:right">Qty</th>
              <th style="text-align:right">Price</th>
              <th style="text-align:right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr>
              <td colspan="3" style="padding:8px;border:1px solid #e5e7eb;text-align:right;font-weight:600">Total</td>
              <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;font-weight:700">${fmt(o.total)}</td>
            </tr>
          </tbody>
        </table>
        <div class="muted" style="margin-top:16px">Thank you for shopping with Kidora.</div>
        <div class="no-print" style="margin-top:16px">
          <button onclick="window.print()" style="padding:8px 12px;border:1px solid #111827;border-radius:8px;background:#111827;color:#fff">Print</button>
        </div>
      </div>
    </body>
    </html>`;
    // Use an invisible iframe for consistent print behavior (avoids popup blockers and noreferrer issues)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow || iframe.contentDocument;
    const iDoc = doc.document || doc;
    iDoc.open();
    iDoc.write(html);
    iDoc.close();
    // Give the browser a tick to render before printing
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch {}
      // Cleanup after a short delay
      setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 500);
    }, 150);
  };

  const statusBadge = (s) => {
    if(s==='pending') return <Badge variant='warning'>Pending</Badge>;
    if(s==='processing') return <Badge variant='info'>Processing</Badge>;
    if(s==='packed') return <Badge variant='secondary'>Packed</Badge>;
    if(s==='out_for_delivery') return <Badge variant='default'>Out for Delivery</Badge>;
    if(s==='shipped') return <Badge variant='default'>Shipped</Badge>;
    if(s==='delivered') return <Badge variant='success'>Delivered</Badge>;
    return s;
  };

  return (
    <div className='space-y-8'>
      <div className='space-y-4'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          <h2 className='text-xl font-semibold text-gray-900'>Orders</h2>
          <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
            <Input placeholder='Search orders...' value={query} onChange={e=>setQuery(e.target.value)} className='sm:w-60' />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className='border border-gray-300 rounded-md px-2 py-2 text-sm'>
              <option value=''>All Status</option>
              {statusOptions.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={methodFilter} onChange={e=>setMethodFilter(e.target.value)} className='border border-gray-300 rounded-md px-2 py-2 text-sm'>
              <option value=''>All Methods</option>
              <option value='cod'>COD</option>
              <option value='online'>Online</option>
            </select>
            <div className='flex gap-2'>
              <select value={sortKey} onChange={e=>setSortKey(e.target.value)} className='border border-gray-300 rounded-md px-2 py-2 text-sm'>
                <option value='date'>ID</option>
                <option value='total'>Total</option>
                <option value='status'>Status</option>
              </select>
              <button onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')} className='border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50'>{sortDir==='asc'?'↑':'↓'}</button>
            </div>
            {(statusFilter||methodFilter||query) && (
              <button onClick={()=>{setQuery('');setStatusFilter('');setMethodFilter('');}} className='text-xs text-blue-600 underline'>Reset</button>
            )}
          </div>
        </div>
        <div className='text-xs text-gray-500 flex flex-wrap gap-4'>
          <span>Total Orders: {combined.length}</span>
          <span>Showing: {filtered.length}</span>
          <span>User Orders: {normalizedUserOrders.length}</span>
        </div>
      </div>
      <Card>
        <CardContent className='overflow-x-auto'>
          {loading && <div className='text-sm text-gray-500 px-3 py-2'>Loading…</div>}
          {error && <div className='text-sm text-red-600 px-3 py-2'>{error}</div>}
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='text-left text-gray-500 border-b'>
                <th className='py-2 pr-4 font-medium'>Order ID</th>
                <th className='py-2 pr-4 font-medium'>Customer</th>
                <th className='py-2 pr-4 font-medium'>Address</th>
                <th className='py-2 pr-4 font-medium'>Items</th>
                <th className='py-2 pr-4 font-medium'>Total</th>
                <th className='py-2 pr-4 font-medium'>Method</th>
                <th className='py-2 pr-4 font-medium'>Status</th>
                <th className='py-2 pr-4 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className='border-b last:border-0 hover:bg-gray-50'>
                  <td className='py-2 pr-4 font-medium text-gray-900'>{o.id}</td>
                  <td className='py-2 pr-4'>{o.customer}</td>
                  <td className='py-2 pr-4'>{o.address}</td>
                  <td className='py-2 pr-4'>{o.items ? o.items.reduce((a,c)=>a+c.qty,0) : 0}</td>
                  <td className='py-2 pr-4'>৳ {o.total}</td>
                  <td className='py-2 pr-4'>{o.method === 'online' ? <Badge variant='info'>Online</Badge> : <Badge>Cash</Badge>}</td>
                  <td className='py-2 pr-4'>{statusBadge(o.status)}</td>
                  <td className='py-2 pr-4 flex gap-2'>
                    <Button variant='outline' onClick={()=>setSelected(o)}>View</Button>
                    {/* Next button removed */}
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={8} className='py-10 text-center text-gray-500'>No orders</td></tr>
              )}
            </tbody>
          </table>
          <div className='flex items-center justify-between py-3'>
            <div className='text-xs text-gray-500'>Page {page+1}</div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={()=> setPage(p=> Math.max(0, p-1))} disabled={page===0}>Prev</Button>
              <Button variant='outline' onClick={()=> setPage(p=> hasMore? p+1 : p)} disabled={!hasMore}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected? `Order ${selected.id}`:''} actions={selected && <>
        <Button onClick={()=>printInvoice(selected)}>Print Invoice</Button>
        <Button variant='outline' onClick={()=>setSelected(null)}>Close</Button>
        {/* Advance Status removed */}
      </>}>
        {selected && (
          <div className='space-y-5'>
            <div className='grid sm:grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-gray-500 text-xs uppercase tracking-wide'>Customer</p>
                <p className='font-medium text-gray-900'>{selected.customer}</p>
              </div>
              <div>
                <p className='text-gray-500 text-xs uppercase tracking-wide'>Phone</p>
                <p className='font-medium text-gray-900'>{selected.phone}</p>
              </div>
              <div className='sm:col-span-2'>
                <p className='text-gray-500 text-xs uppercase tracking-wide'>Address</p>
                <p className='font-medium text-gray-900'>{selected.address}</p>
              </div>
            </div>
            <div className='text-sm'>
              <p className='text-gray-500 text-xs uppercase tracking-wide mb-2'>Items</p>
              {selected.items && selected.items.length>0 ? (
                <div className='border rounded-lg overflow-hidden'>
                  <table className='min-w-full text-xs'>
                    <thead className='bg-gray-50 text-gray-600'>
                      <tr>
                        <th className='text-left px-3 py-2 font-medium'>Product</th>
                        <th className='text-left px-3 py-2 font-medium'>Qty</th>
                        <th className='text-left px-3 py-2 font-medium'>Price</th>
                        <th className='text-left px-3 py-2 font-medium'>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items.map(it => (
                        <tr key={it.id} className='border-t'>
                          <td className='px-3 py-2 font-medium text-gray-900'>{it.title}{it.selectedSize ? ` • Size: ${it.selectedSize}` : ''}</td>
                          <td className='px-3 py-2'>{it.qty}</td>
                          <td className='px-3 py-2'>৳ {it.price}</td>
                          <td className='px-3 py-2 font-semibold'>৳ {it.price * it.qty}</td>
                        </tr>
                      ))}
                      <tr className='bg-gray-50 border-t'>
                        <td colSpan={3} className='px-3 py-2 text-right font-medium'>Total</td>
                        <td className='px-3 py-2 font-bold text-gray-900'>৳ {selected.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : <p className='text-gray-500 italic'>No items found</p>}
            </div>
            <div className='text-sm'>
              <p className='text-gray-500 text-xs uppercase tracking-wide mb-1'>Payment</p>
              {selected.method === 'online' ? (
                <div className='space-y-1'>
                  <p><span className='font-medium'>Method:</span> Online</p>
                  <p><span className='font-medium'>Sender:</span> {selected.senderNumber}</p>
                  <p><span className='font-medium'>Transaction ID:</span> {selected.transactionId}</p>
                </div>
              ) : <p>Cash on Delivery</p>}
            </div>
            <div>
              <p className='text-gray-500 text-xs uppercase tracking-wide mb-1'>Status</p>
              {statusBadge(selected.status)}
            </div>
            {selected.source === 'backend' && (
              <div className='grid sm:grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-500 text-xs uppercase tracking-wide mb-1'>Update Status</p>
                  <div className='flex gap-2'>
                    <select value={selected.status} onChange={e=> setSelected(s=> ({...s, status: e.target.value}))} className='border border-gray-300 rounded-md px-2 py-2 text-sm'>
                      {statusOptions.map(s=> <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Button onClick={()=> setStatusExplicit(selected, selected.status)}>Save</Button>
                  </div>
                </div>
                <div>
                  <p className='text-gray-500 text-xs uppercase tracking-wide mb-1'>Payment Status</p>
                  <div className='flex gap-2'>
                    <select value={selected.paymentStatus || 'pending'} onChange={e=> setSelected(s=> ({...s, paymentStatus: e.target.value}))} className='border border-gray-300 rounded-md px-2 py-2 text-sm'>
                      {paymentOptions.map(p=> <option key={p} value={p}>{p}</option>)}
                    </select>
                    <Button onClick={()=> setPaymentExplicit(selected, selected.paymentStatus || 'pending')}>Save</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
