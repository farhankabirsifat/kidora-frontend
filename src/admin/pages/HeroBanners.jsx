import { useState, useRef } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const initialBanners = [
  { id: 1, title: 'Printed Cotton Taaga Dress', description: 'Premium quality printed cotton dress for kids. Soft, stylish, and perfect for all occasions.', price: '৳ 2006', oldPrice: '৳ 3006', discount: 33, image: '/hero.png', rating: 4.9, reviews: '1000+', category: 'kids', features: ['FREE SHIPPING WORLDWIDE','QUALITY GUARANTEE'] },
  { id: 2, title: 'Trendy Boys Polo Shirt', description: 'Trendy and comfortable polo shirt for boys. Perfect for all-day wear.', price: '৳ 950', oldPrice: '৳ 1200', discount: 21, image: '/hero2.png', rating: 4.7, reviews: '800+', category: 'men', features: ['EASY RETURNS','FAST DELIVERY'] },
];

export default function HeroBanners() {
  const [banners, setBanners] = useState(initialBanners);
  const [open, setOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    discount: '',
    image: '',
    rating: '',
    reviews: '',
    category: '',
    featureInput: '',
    features: [],
    _imageFile: null,
  });
  const imageInputRef = useRef(null);

  const isValid = newBanner.title && newBanner.image && newBanner.price && newBanner.oldPrice;

  const addBanner = () => {
    if(!isValid) return;
  const { featureInput: _unusedFeature, _imageFile: _unusedFile, ...rest } = newBanner;
    setBanners(prev => [{ id: Date.now(), ...rest, discount: rest.discount || 0, rating: rest.rating || 0 }, ...prev]);
    setNewBanner({ title: '', description:'', price:'', oldPrice:'', discount:'', image:'', rating:'', reviews:'', category:'', featureInput:'', features:[], _imageFile:null });
    setOpen(false);
  };

  const removeBanner = (id) => setBanners(prev => prev.filter(b=>b.id!==id));

  const addFeature = () => {
    if(!newBanner.featureInput.trim()) return;
    setNewBanner(p=>({...p, features:[...p.features, p.featureInput.trim()], featureInput:''}));
  };

  const removeFeature = (idx) => setNewBanner(p=>({...p, features: p.features.filter((_,i)=>i!==idx)}));

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if(file){
      const url = URL.createObjectURL(file);
      setNewBanner(p=>({...p, image:url, _imageFile:file }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Hero Banners</h2>
        <Button onClick={()=>setOpen(true)}>Add Banner</Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {banners.map(b => (
          <Card key={b.id} className="overflow-hidden group">
            <div className="aspect-[5/3] bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <Button variant="destructive" onClick={()=>removeBanner(b.id)}>Delete</Button>
              </div>
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">{b.discount}% OFF</div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{b.title}</CardTitle>
              <div className="text-xs text-gray-500 flex gap-2 flex-wrap">
                <span>{b.category}</span>
                <span>⭐ {b.rating}</span>
                <span>{b.reviews}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <p className="text-xs text-gray-600 line-clamp-2">{b.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-900">{b.price}</span>
                <span className="text-gray-400 line-through text-xs">{b.oldPrice}</span>
              </div>
              {b.features?.length>0 && (
                <ul className="flex flex-wrap gap-1">
                  {b.features.map((f,i)=>(
                    <li key={i} className="bg-gray-100 text-[10px] px-2 py-1 rounded">{f}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
        {banners.length===0 && (
          <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-xl">No banners yet</div>
        )}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title="Add Hero Banner" actions={
        <>
          <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={addBanner} disabled={!isValid} className={!isValid? 'opacity-60 cursor-not-allowed':''}>Save</Button>
        </>
      }>
        <div className="space-y-6 max-h-[70vh] pr-1 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center justify-between text-[11px] font-medium text-gray-600 mb-1">Title * {!newBanner.title && <span className="text-red-500 font-normal">Required</span>}</label>
              <Input value={newBanner.title} onChange={e=>setNewBanner(p=>({...p,title:e.target.value}))} placeholder="Banner title" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Category</label>
              <select value={newBanner.category} onChange={e=>setNewBanner(p=>({...p,category:e.target.value}))} className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select...</option>
                <option value="kids">Kids</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-gray-600 mb-1">Description</label>
            <Textarea rows={3} value={newBanner.description} onChange={e=>setNewBanner(p=>({...p,description:e.target.value}))} placeholder="Short description" />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Price *</label>
              <Input value={newBanner.price} onChange={e=>setNewBanner(p=>({...p,price:e.target.value}))} placeholder="৳ ..." />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Old Price *</label>
              <Input value={newBanner.oldPrice} onChange={e=>setNewBanner(p=>({...p,oldPrice:e.target.value}))} placeholder="৳ ..." />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Discount %</label>
              <Input type="number" value={newBanner.discount} onChange={e=>setNewBanner(p=>({...p,discount:e.target.value}))} placeholder="0" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Rating</label>
              <Input type="number" step="0.1" value={newBanner.rating} onChange={e=>setNewBanner(p=>({...p,rating:e.target.value}))} placeholder="4.5" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Reviews</label>
              <Input value={newBanner.reviews} onChange={e=>setNewBanner(p=>({...p,reviews:e.target.value}))} placeholder="1000+" />
            </div>
            <div>
              <label className="flex items-center justify-between text-[11px] font-medium text-gray-600 mb-1">Main Image * {!newBanner.image && <span className="text-red-500 font-normal">Required</span>}</label>
              <div onClick={()=>imageInputRef.current?.click()} className={`border-2 border-dashed rounded-md p-4 text-center text-xs cursor-pointer ${newBanner.image? 'border-green-300 bg-green-50':'hover:border-gray-400 border-gray-300'}`}>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {newBanner.image ? 'Replace Image' : 'Click to Upload'}
                {newBanner.image && <img src={newBanner.image} alt="preview" className="mt-2 h-24 w-24 object-cover rounded" />}
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-gray-600 mb-1">Features</label>
            <div className="flex gap-2 mb-2">
              <Input value={newBanner.featureInput} onChange={e=>setNewBanner(p=>({...p,featureInput:e.target.value}))} placeholder="Add feature" />
              <Button type="button" variant="outline" onClick={addFeature} className="whitespace-nowrap">+ Add</Button>
            </div>
            {newBanner.features.length>0 && (
              <div className="flex flex-wrap gap-2">
                {newBanner.features.map((f,i)=>(
                  <span key={i} className="bg-gray-100 text-[11px] px-2 py-1 rounded flex items-center gap-1">{f}<button type="button" onClick={()=>removeFeature(i)} className="text-red-500 hover:text-red-600">×</button></span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
