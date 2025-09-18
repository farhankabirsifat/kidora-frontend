import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { listProducts, createProduct, updateProduct, deleteProduct as apiDeleteProduct, mapProductOutToUi } from '../../services/products';

// Extended product model aligned with shop data structure
// Fields: id, title, price, stock, rating, category, discount, description, video, image, images[]
const initialProducts = [
  {
    id: 1,
    title: 'Stylish Check Shirt',
    price: 567,
    stock: 25,
    rating: 4.5,
    category: 'men',
    discount: 20,
    description: 'This stylish check shirt is perfect for casual and semi-formal occasions.',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop&auto=format'
    ],
  },
  {
    id: 2,
    title: 'Casual Blue Shirt',
    price: 500,
    stock: 8,
    rating: 4.0,
    category: 'men',
    discount: 0,
    description: 'A comfortable casual blue shirt perfect for everyday wear.',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop&auto=format'
    ],
  },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState(''); // low | out | in
  const [sortKey, setSortKey] = useState('created');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState([]); // ids
  const [openNew, setOpenNew] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    rating: '',
    category: '',
    discount: '',
    description: '',
    video: '',
    image: '', // object URL preview for main image
    images: [], // array of object URL previews for additional images
    _imageFile: null, // internal file ref (not persisted externally)
    _imageFiles: [], // internal file refs
    sizes: { XS:'', S:'', M:'', L:'', XL:'', XXL:'' }
  });
  const additionalImagesInputRef = useRef(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const editAdditionalInputRef = useRef(null);

  // load from backend
  useEffect(()=>{
    (async ()=>{
      setLoading(true); setError('');
      try{
        const data = await listProducts({ page, size });
        setProducts(data.map(mapProductOutToUi));
      }catch(e){
        setError(e?.message || 'Failed to load products');
      }finally{ setLoading(false); }
    })();
  },[page, size]);

  const toggleSort = (key) => {
    setSortKey(prev => prev===key ? key : key);
    setSortDir(prev => (sortKey===key ? (prev==='asc'?'desc':'asc') : 'asc'));
  };

  const filtered = useMemo(()=>{
    let list = products.filter(p => p.title.toLowerCase().includes(query.toLowerCase().trim()));
    if(categoryFilter) list = list.filter(p=>p.category === categoryFilter);
    if(stockFilter){
      if(stockFilter==='out') list = list.filter(p=>p.stock===0);
      else if(stockFilter==='low') list = list.filter(p=>p.stock>0 && p.stock<10);
      else if(stockFilter==='in') list = list.filter(p=>p.stock>=10);
    }
    list = [...list].sort((a,b)=>{
      if(sortKey==='title') return sortDir==='asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      if(sortKey==='price') return sortDir==='asc' ? a.price - b.price : b.price - a.price;
      if(sortKey==='stock') return sortDir==='asc' ? a.stock - b.stock : b.stock - a.stock;
      if(sortKey==='rating') return sortDir==='asc' ? (a.rating||0)-(b.rating||0) : (b.rating||0)-(a.rating||0);
      return 0;
    });
    return list;
  },[products, query, categoryFilter, stockFilter, sortKey, sortDir]);

  const kpis = useMemo(()=>{
    const total = products.length;
    const low = products.filter(p=>p.stock>0 && p.stock<10).length;
    const out = products.filter(p=>p.stock===0).length;
    const avgRating = products.length ? (products.reduce((s,p)=>s+(p.rating||0),0)/products.length).toFixed(1) : '0.0';
    return { total, low, out, avgRating };
  },[products]);

  const isValid = newProduct.title && newProduct.price && newProduct.image;

  const handleAdd = async () => {
    if(!isValid) return;
    try{
      const sizesClean = Object.fromEntries(Object.entries(newProduct.sizes||{}).filter(([k,v])=>v!=='' && !isNaN(Number(v))).map(([k,v])=>[k, Number(v)]));
      const created = await createProduct({
        title: newProduct.title,
        description: newProduct.description,
        price: Number(newProduct.price),
        category: newProduct.category || 'uncategorized',
        rating: newProduct.rating ? Number(newProduct.rating) : 0,
        discount: newProduct.discount ? Number(newProduct.discount) : 0,
        mainImageFile: newProduct._imageFile,
        imageFiles: newProduct._imageFiles,
        sizes: sizesClean,
      });
      const mapped = mapProductOutToUi(created);
      setProducts(prev => [mapped, ...prev]);
    // reset
    setNewProduct({ title: '', price: '', rating: '', category: '', discount: '', description: '', video: '', image: '', images: [], _imageFile: null, _imageFiles: [], sizes: { XS:'', S:'', M:'', L:'', XL:'', XXL:'' } });
      setOpenNew(false);
    }catch(e){ setError(e?.message || 'Failed to create product'); }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if(file){
      const url = URL.createObjectURL(file);
      setNewProduct(p=>({...p, image: url, _imageFile: file }));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if(files.length){
      const urls = files.map(f=>URL.createObjectURL(f));
      setNewProduct(p=>({...p, images: [...p.images, ...urls], _imageFiles: [...p._imageFiles, ...files] }));
    }
    // reset input so same file can be re-added if needed
    if(e.target) e.target.value='';
  };

  const computeTotalFromSizes = (sizesObj) => {
    try {
      return Object.values(sizesObj||{}).reduce((sum, v)=> sum + (Number(v)||0), 0);
    } catch { return 0; }
  };

  const removeAdditionalImage = (idx) => {
    setNewProduct(p=>{
      const imgs = [...p.images];
      const [removed] = imgs.splice(idx,1);
      if(removed && removed.startsWith('blob:')) URL.revokeObjectURL(removed);
      return {...p, images: imgs, _imageFiles: p._imageFiles.filter((_,i)=>i!==idx)};
    });
  };

  const onDropMain = useCallback((e)=>{
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files[0]){
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setNewProduct(p=>({...p, image: url, _imageFile: file }));
    }
  },[]);
  const onDropAdditional = useCallback((e)=>{
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter(f=>f.type.startsWith('image/'));
    if(files.length){
      const urls = files.map(f=>URL.createObjectURL(f));
      setNewProduct(p=>({...p, images: [...p.images, ...urls], _imageFiles: [...p._imageFiles, ...files] }));
    }
  },[]);

  const handleDelete = async (id) => {
    try { await apiDeleteProduct(id); setProducts(prev => prev.filter(p=>p.id!==id)); }
    catch(e){ setError(e?.message || 'Failed to delete'); }
  };
  const handleBulkDelete = () => {
    if(!selected.length) return;
    setProducts(prev => prev.filter(p=>!selected.includes(p.id)));
    setSelected([]);
  };

  const allOnPageSelected = filtered.length>0 && filtered.every(p=>selected.includes(p.id));
  const toggleSelectAll = () => {
    if(allOnPageSelected) setSelected(prev=>prev.filter(id=>!filtered.some(p=>p.id===id)));
    else setSelected(prev=>[...new Set([...prev, ...filtered.map(p=>p.id)])]);
  };
  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev, id]);

  // editing logic
  const openEditModal = (product) => {
    const initialSizes = product?.sizes || product?._raw?.sizes_stock || {};
    const norm = { XS:'', S:'', M:'', L:'', XL:'', XXL:'' };
    for(const k of Object.keys(initialSizes||{})){
      if(k in norm) norm[k] = String(initialSizes[k] ?? '');
    }
    setEditProduct({ ...product, featureInput:'', _imageFile:null, _imageFiles:[], sizes: norm });
    setOpenEdit(true);
  };

  const isEditValid = editProduct && editProduct.title && editProduct.price!=='' && editProduct.image;

  const saveEditedProduct = async () => {
    if(!isEditValid) return;
    try{
      const { _imageFile, _imageFiles, featureInput: _unusedFeature, sizes, ...clean } = editProduct;
      const sizesClean = Object.fromEntries(Object.entries(sizes||{}).filter(([k,v])=>v!=='' && !isNaN(Number(v))).map(([k,v])=>[k, Number(v)]));
      const updated = await updateProduct(clean.id, {
        title: clean.title,
        description: clean.description,
        price: Number(clean.price),
        category: clean.category || 'uncategorized',
        rating: clean.rating ? Number(clean.rating) : 0,
        discount: clean.discount ? Number(clean.discount) : 0,
        mainImageFile: _imageFile || undefined,
        imageFiles: _imageFiles && _imageFiles.length ? _imageFiles : undefined,
        sizes: sizesClean,
      });
      const mapped = mapProductOutToUi(updated);
      setProducts(prev => prev.map(p=>p.id===mapped.id ? mapped : p));
      setOpenEdit(false);
      setEditProduct(null);
    }catch(e){ setError(e?.message || 'Failed to update product'); }
  };

  const handleEditMainImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if(file){
      const url = URL.createObjectURL(file);
      setEditProduct(p=>({...p, image:url, _imageFile:file }));
    }
  };

  const handleEditAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if(files.length){
      const urls = files.map(f=>URL.createObjectURL(f));
      setEditProduct(p=>({...p, images:[...(p.images||[]), ...urls], _imageFiles:[...(p._imageFiles||[]), ...files] }));
    }
    if(e.target) e.target.value='';
  };

  const removeEditAdditionalImage = (idx) => {
    setEditProduct(p=>{
      const imgs=[...(p.images||[])];
      const [removed]=imgs.splice(idx,1);
      if(removed && removed.startsWith('blob:')) URL.revokeObjectURL(removed);
      return {...p, images:imgs, _imageFiles:(p._imageFiles||[]).filter((_,i)=>i!==idx)};
    });
  };

  const statusBadge = (p) => {
  if(p.stock === 0) return <Badge variant="danger">Out</Badge>;
  if(p.stock < 10) return <Badge variant="warning">Low</Badge>;
  return <Badge variant="success">OK</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <Input placeholder="Search..." value={query} onChange={e=>setQuery(e.target.value)} className="sm:w-48" />
              <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="border border-gray-300 rounded-md text-sm px-2 py-2 bg-white">
                <option value="">All Categories</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="kids-boys">Kids - Boys</option>
                <option value="kids-girls">Kids - Girls</option>
              </select>
              <select value={stockFilter} onChange={e=>setStockFilter(e.target.value)} className="border border-gray-300 rounded-md text-sm px-2 py-2 bg-white">
                <option value="">All Stock</option>
                <option value="in">In Stock (10+)</option>
                <option value="low">Low (&lt;10)</option>
                <option value="out">Out</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              {selected.length>0 && <Button variant="destructive" onClick={handleBulkDelete}>Delete Selected ({selected.length})</Button>}
              <Button onClick={()=>setOpenNew(true)}>Add Product</Button>
            </div>
          </div>
        </div>
        {/* KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border bg-white shadow-sm">
            <div className="text-[10px] uppercase tracking-wide text-gray-500">Total</div>
            <div className="text-lg font-semibold">{kpis.total}</div>
          </div>
          <div className="p-3 rounded-lg border bg-white shadow-sm">
            <div className="text-[10px] uppercase tracking-wide text-gray-500">Low Stock</div>
            <div className="text-lg font-semibold text-amber-600">{kpis.low}</div>
          </div>
            <div className="p-3 rounded-lg border bg-white shadow-sm">
            <div className="text-[10px] uppercase tracking-wide text-gray-500">Out of Stock</div>
            <div className="text-lg font-semibold text-red-600">{kpis.out}</div>
          </div>
          <div className="p-3 rounded-lg border bg-white shadow-sm">
            <div className="text-[10px] uppercase tracking-wide text-gray-500">Avg Rating</div>
            <div className="text-lg font-semibold text-indigo-600">{kpis.avgRating}</div>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4 font-medium w-8"><input type="checkbox" checked={allOnPageSelected} onChange={toggleSelectAll} /></th>
                <th className="py-2 pr-4 font-medium">Product</th>
                <th className="py-2 pr-4 font-medium cursor-pointer" onClick={()=>toggleSort('title')}>Title {sortKey==='title' && (sortDir==='asc'?'▲':'▼')}</th>
                <th className="py-2 pr-4 font-medium cursor-pointer" onClick={()=>toggleSort('price')}>Price {sortKey==='price' && (sortDir==='asc'?'▲':'▼')}</th>
                <th className="py-2 pr-4 font-medium cursor-pointer" onClick={()=>toggleSort('stock')}>Stock {sortKey==='stock' && (sortDir==='asc'?'▲':'▼')}</th>
                <th className="py-2 pr-4 font-medium">Sizes</th>
                <th className="py-2 pr-4 font-medium">Cat.</th>
                <th className="py-2 pr-4 font-medium cursor-pointer" onClick={()=>toggleSort('rating')}>Rating {sortKey==='rating' && (sortDir==='asc'?'▲':'▼')}</th>
                <th className="py-2 pr-4 font-medium">Disc%</th>
                <th className="py-2 pr-4 font-medium">Status</th>
		<th className="py-2 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={11} className="py-6 text-center text-gray-500">Loading…</td></tr>
              )}
              {error && !loading && (
                <tr><td colSpan={11} className="py-6 text-center text-red-600">{error}</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className={`border-b last:border-0 ${selected.includes(p.id)?'bg-indigo-50/50':''}`}>
                  <td className="py-2 pr-4 align-top"><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggleSelect(p.id)} /></td>
                  <td className="py-2 pr-4">
                    {p.image && <img src={p.image} alt={p.title} className="h-12 w-12 rounded object-cover border" />}
                  </td>
                  <td className="py-2 pr-4 font-medium text-gray-900 min-w-[160px]">
		  {p.title}
                    <div className="text-[11px] text-gray-400">ID: {p.id}</div>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap font-medium">৳ {p.price}</td>
                  <td className="py-2 pr-4 w-24 font-mono">{p.stock}</td>
                  <td className="py-2 pr-4 text-[11px] text-gray-600">
                    {p.sizes ? (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(p.sizes).map(([sz,qty])=> (
                          <span key={sz} className={`px-1.5 py-0.5 rounded border ${Number(qty)>0? 'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-gray-50 border-gray-200 text-gray-500'}`}>{sz}:{qty}</span>
                        ))}
                      </div>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap capitalize">{p.category||'-'}</td>
                  <td className="py-2 pr-4 w-20">{p.rating || 0}</td>
                  <td className="py-2 pr-4 w-20">{p.discount || 0}</td>
                  <td className="py-2 pr-4">{statusBadge(p)}</td>
                  <td className="py-2 pr-4 flex gap-2">
		  <Button variant="outline" onClick={()=>openEditModal(p)}>Edit</Button>
                    <Button variant="destructive" onClick={()=>handleDelete(p.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && !loading && !error && (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-gray-500">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between py-3">
            <div className="text-xs text-gray-500">Page {page+1}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=> setPage(p=> Math.max(0, p-1))} disabled={page===0}>Prev</Button>
              <Button variant="outline" onClick={()=> setPage(p=> p+1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

  <Modal open={openNew} onClose={()=>setOpenNew(false)} title="Add Product" actions={
        <>
          <Button variant="outline" onClick={()=>setOpenNew(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!isValid} className={!isValid? 'opacity-60 cursor-not-allowed':''}>Save</Button>
        </>
      }>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/40">
            <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Basic Info</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center justify-between text-[11px] font-medium text-gray-600 mb-1">Title * {!newProduct.title && <span className="text-red-500 font-normal">Required</span>}</label>
                <Input className={!newProduct.title? 'border-red-300 focus:ring-red-300':''} value={newProduct.title} onChange={e=>setNewProduct(p=>({...p,title:e.target.value}))} placeholder="Product title" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center justify-between text-[11px] font-medium text-gray-600 mb-1">Price * {!newProduct.price && <span className="text-red-500 font-normal">Required</span>}</label>
                  <Input type="number" className={!newProduct.price? 'border-red-300 focus:ring-red-300':''} value={newProduct.price} onChange={e=>setNewProduct(p=>({...p,price:e.target.value}))} />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-1">Category</label>
                  <select
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newProduct.category}
                    onChange={e=>setNewProduct(p=>({...p,category:e.target.value}))}
                  >
                    <option value="">Select...</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="kids-boys">Kids - Boys</option>
                    <option value="kids-girls">Kids - Girls</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Pricing & Ratings */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Ratings & Offers</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-medium text-gray-600 mb-1">Rating</label>
                <Input type="number" step="0.1" value={newProduct.rating} onChange={e=>setNewProduct(p=>({...p,rating:e.target.value}))} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-600 mb-1">Discount %</label>
                <Input type="number" value={newProduct.discount} onChange={e=>setNewProduct(p=>({...p,discount:e.target.value}))} />
              </div>
            </div>
          </div>
          {/* Sizes (optional) */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/40">
            <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Per-size Stock (optional)</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {['XS','S','M','L','XL','XXL'].map(sz=> (
                <div key={sz}>
                  <label className="text-[11px] font-medium text-gray-600 mb-1">{sz}</label>
                  <Input type="number" min="0" value={newProduct.sizes[sz]} onChange={e=>setNewProduct(p=>({...p, sizes: { ...p.sizes, [sz]: e.target.value }}))} />
                </div>
              ))}
            </div>
            <div className="text-[11px] text-gray-500 mt-2 flex items-center justify-between">
              <span>Leave blank for sizes you don’t stock.</span>
              <span className="font-medium text-gray-700">Total (computed): {computeTotalFromSizes(newProduct.sizes)}</span>
            </div>
          </div>
          {/* Media */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/40">
            <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase flex items-center justify-between">Media {!newProduct.image && <span className="text-red-500 normal-case font-normal">Main image required</span>}</h4>
                <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-medium text-gray-600 mb-2">Main Image *</label>
                <div
                  onDragOver={e=>e.preventDefault()}
                  onDrop={onDropMain}
                  className={`border-2 border-dashed rounded-md p-4 text-center text-xs cursor-pointer transition ${newProduct.image? 'border-green-300 bg-green-50':'hover:border-gray-400 border-gray-300'}`}
                >
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" id="mainImageInput" />
                  <label htmlFor="mainImageInput" className="block cursor-pointer">
                    {newProduct.image ? 'Replace Image' : 'Click or Drag & Drop to Upload'}
                  </label>
                  {newProduct.image && <img src={newProduct.image} alt="main" className="mt-3 h-28 w-28 object-cover rounded shadow-sm inline-block" />}
                </div>
              </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-2 flex items-center justify-between">Additional Images
                      <Button type="button" variant="outline" className="h-6 px-2 text-[10px]" onClick={()=>additionalImagesInputRef.current?.click()}>+ Add</Button>
                    </label>
                    <div
                      onDragOver={e=>e.preventDefault()}
                      onDrop={onDropAdditional}
                      className="border-2 border-dashed rounded-md p-4 text-center text-xs cursor-pointer hover:border-gray-400 border-gray-300"
                      onClick={()=>additionalImagesInputRef.current?.click()}
                    >
                      <input ref={additionalImagesInputRef} type="file" multiple accept="image/*" onChange={handleAdditionalImagesChange} className="hidden" />
                      <span className="block">Click, Drag & Drop or use + Add to select images</span>
                      {newProduct.images?.length>0 && (
                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                          {newProduct.images.map((img,i)=>(
                            <div key={i} className="relative group">
                              <img src={img} alt={"img"+i} className="h-16 w-16 object-cover rounded border" />
                              <button type="button" onClick={(e)=>{e.stopPropagation();removeAdditionalImage(i);}} className="absolute -top-1 -right-1 bg-black/70 text-white rounded-full w-5 h-5 text-[10px] opacity-0 group-hover:opacity-100 transition">×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-medium text-gray-600 mb-2">Video (embed URL)</label>
                    <Input value={newProduct.video} onChange={e=>setNewProduct(p=>({...p,video:e.target.value}))} placeholder="https://www.youtube.com/embed/..." />
              </div>
            </div>
          </div>
          {/* Description */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Description</h4>
              <div>
                <Textarea rows={4} value={newProduct.description} onChange={e=>setNewProduct(p=>({...p,description:e.target.value}))} placeholder="Short product description" />
                <div className="text-[10px] text-gray-400 mt-1 text-right">{newProduct.description.length} chars</div>
              </div>
            </div>
        </div>
      </Modal>
      {/* Edit Product Modal */}
      <Modal open={openEdit} onClose={()=>{setOpenEdit(false);setEditProduct(null);}} title={editProduct? `Edit: ${editProduct.title}`:'Edit Product'} actions={
        <>
          <Button variant="outline" onClick={()=>{setOpenEdit(false);setEditProduct(null);}}>Cancel</Button>
          <Button onClick={saveEditedProduct} disabled={!isEditValid} className={!isEditValid? 'opacity-60 cursor-not-allowed':''}>Update</Button>
        </>
      }>
        {editProduct && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/40">
              <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Basic Info</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-1">Title *</label>
                  <Input value={editProduct.title} onChange={e=>setEditProduct(p=>({...p,title:e.target.value}))} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1">Price *</label>
                    <Input type="number" value={editProduct.price} onChange={e=>setEditProduct(p=>({...p,price:e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1">Category</label>
                    <select className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editProduct.category} onChange={e=>setEditProduct(p=>({...p,category:e.target.value}))}>
                      <option value="">Select...</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                      <option value="kids-boys">Kids - Boys</option>
                      <option value="kids-girls">Kids - Girls</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Ratings & Offers</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-1">Rating</label>
                  <Input type="number" step="0.1" value={editProduct.rating} onChange={e=>setEditProduct(p=>({...p,rating:e.target.value}))} />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-1">Discount %</label>
                  <Input type="number" value={editProduct.discount} onChange={e=>setEditProduct(p=>({...p,discount:e.target.value}))} />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-1">Video (embed URL)</label>
                  <Input value={editProduct.video} onChange={e=>setEditProduct(p=>({...p,video:e.target.value}))} placeholder="https://www.youtube.com/embed/..." />
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/40">
              <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Per-size Stock</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {['XS','S','M','L','XL','XXL'].map(sz=> (
                  <div key={sz}>
                    <label className="text-[11px] font-medium text-gray-600 mb-1">{sz}</label>
                    <Input type="number" min="0" value={editProduct.sizes?.[sz] ?? ''} onChange={e=>setEditProduct(p=>({...p, sizes: { ...(p.sizes||{}), [sz]: e.target.value }}))} />
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-gray-500 mt-2 flex items-center justify-between">
                <span>Blank means size not tracked.</span>
                <span className="font-medium text-gray-700">Total (computed): {computeTotalFromSizes(editProduct.sizes)}</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/40">
              <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Media</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-2">Main Image *</label>
                  <div className={`border-2 border-dashed rounded-md p-4 text-center text-xs cursor-pointer ${editProduct.image? 'border-green-300 bg-green-50':'hover:border-gray-400 border-gray-300'}`} onClick={()=>document.getElementById('editMainImageInput').click()}>
                    <input id="editMainImageInput" type="file" accept="image/*" onChange={handleEditMainImageChange} className="hidden" />
                    {editProduct.image ? 'Replace Image' : 'Click to Upload'}
                    {editProduct.image && <img src={editProduct.image} alt="main" className="mt-3 h-28 w-28 object-cover rounded shadow-sm inline-block" />}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-2 flex items-center justify-between">Additional Images <Button type="button" variant="outline" className="h-6 px-2 text-[10px]" onClick={()=>editAdditionalInputRef.current?.click()}>+ Add</Button></label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center text-xs cursor-pointer hover:border-gray-400 border-gray-300" onClick={()=>editAdditionalInputRef.current?.click()}>
                    <input ref={editAdditionalInputRef} type="file" multiple accept="image/*" onChange={handleEditAdditionalImagesChange} className="hidden" />
                    <span className="block">Click or use + Add</span>
                    {editProduct.images?.length>0 && (
                      <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        {editProduct.images.map((img,i)=>(
                          <div key={i} className="relative group">
                            <img src={img} alt={'img'+i} className="h-16 w-16 object-cover rounded border" />
                            <button type="button" onClick={(e)=>{e.stopPropagation();removeEditAdditionalImage(i);}} className="absolute -top-1 -right-1 bg-black/70 text-white rounded-full w-5 h-5 text-[10px] opacity-0 group-hover:opacity-100 transition">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-xs font-semibold tracking-wide text-gray-600 mb-3 uppercase">Description</h4>
              <Textarea rows={4} value={editProduct.description} onChange={e=>setEditProduct(p=>({...p,description:e.target.value}))} />
              <div className="text-[10px] text-gray-400 mt-1 text-right">{(editProduct.description||'').length} chars</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
