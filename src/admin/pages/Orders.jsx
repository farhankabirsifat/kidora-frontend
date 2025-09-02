import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useOrders } from '../../context/useOrders';

// Include sample admin-only orders with line item details
const initialOrders = [
  { id: 'ORD-1005', customer: 'Hasan', phone: '01711xxxxxx', address: 'Dhaka', total: 1567, method: 'cod', status: 'pending', items: [
    { id: 1, title: 'Stylish Check Shirt', qty: 1, price: 567 },
    { id: 2, title: 'Casual Blue Shirt', qty: 2, price: 500 },
  ] },
  { id: 'ORD-1004', customer: 'Nila', phone: '01822xxxxxx', address: 'Chittagong', total: 500, method: 'online', senderNumber: '01710xxxxx1', transactionId: 'AB12CD3', status: 'processing', items:[
    { id: 3, title: 'Formal Dress Shirt', qty: 1, price: 500 }
  ] },
  { id: 'ORD-1003', customer: 'Rafi', phone: '01633xxxxxx', address: 'Sylhet', total: 890, method: 'cod', status: 'shipped', items:[
    { id: 5, title: 'Premium Kids Tee', qty: 1, price: 450 },
    { id: 6, title: 'Soft Cotton Shorts', qty: 1, price: 440 }
  ] },
];

const statusFlow = ['pending','processing','shipped','delivered'];

export default function Orders() {
  const { orders: userOrders, advanceOrderStatus } = useOrders();
  const [orders, setOrders] = useState(initialOrders); // admin-managed sample orders
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Normalize user orders from context so they display in admin list
  const normalizedUserOrders = useMemo(()=>
    userOrders.map(o => ({
      id: o.id,
      customer: o.shipping?.name || 'Customer',
      phone: o.shipping?.phone || '',
      address: o.shipping?.address || '',
      total: o.total,
      method: o.payment?.method || 'cod',
      senderNumber: o.payment?.senderNumber || null,
      transactionId: o.payment?.transactionId || null,
      status: (o.tracking?.current === 'delivered' || o.status === 'delivered') ? 'delivered' : (o.tracking?.current || o.status || 'processing'),
      items: o.items || [],
      source: 'user'
    })),
    [userOrders]
  );

  const combined = [...normalizedUserOrders, ...orders];

  const applySort = (list) => {
    const sorted = [...list];
    sorted.sort((a,b)=>{
      if(sortKey==='total') return sortDir==='asc'? a.total - b.total : b.total - a.total;
      if(sortKey==='status') return sortDir==='asc'? a.status.localeCompare(b.status): b.status.localeCompare(a.status);
      return sortDir==='asc'? a.id.localeCompare(b.id): b.id.localeCompare(a.id); // id fallback
    });
    return sorted;
  };

  const filtered = applySort(combined.filter(o => (
    (o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.toLowerCase().includes(query.toLowerCase())) &&
    (!statusFilter || o.status===statusFilter) &&
    (!methodFilter || o.method===methodFilter)
  )));

  const nextStatus = (o) => {
    if(o.source === 'user') {
      advanceOrderStatus(o.id);
      setSelected(s=> s && s.id===o.id ? { ...s, status: 'updated' }: s); // will refresh on next render from context
      return;
    }
    const idx = statusFlow.indexOf(o.status);
    if(idx < statusFlow.length -1) {
      const updated = statusFlow[idx+1];
      setOrders(prev => prev.map(ord => ord.id===o.id? { ...ord, status: updated }: ord));
      setSelected(s => s && s.id===o.id? { ...s, status: updated }: s);
    }
  };

  const statusBadge = (s) => {
    if(s==='pending') return <Badge variant='warning'>Pending</Badge>;
    if(s==='processing') return <Badge variant='info'>Processing</Badge>;
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
              {statusFlow.map(s=> <option key={s} value={s}>{s}</option>)}
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
                    {o.status !== 'delivered' && (
                      <Button variant='default' onClick={()=>nextStatus(o)}>Next</Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={8} className='py-10 text-center text-gray-500'>No orders</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected? `Order ${selected.id}`:''} actions={selected && <>
        <Button variant='outline' onClick={()=>setSelected(null)}>Close</Button>
        {selected.status !== 'delivered' && selected.source !== 'user' && (
          <Button onClick={()=>nextStatus(selected)}>Advance Status</Button>
        )}
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
                          <td className='px-3 py-2 font-medium text-gray-900'>{it.title}</td>
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
          </div>
        )}
      </Modal>
    </div>
  );
}
