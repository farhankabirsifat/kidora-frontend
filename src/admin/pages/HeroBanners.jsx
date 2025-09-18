import { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { listHeroBanners, createHeroBanner, deleteHeroBanner, updateHeroBanner } from '../../services/hero';

export default function HeroBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    linkUrl: '',
    imagePreview: '',
    imageUrlText: '',
    _imageFile: null,
  });
  const imageInputRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data = await listHeroBanners();
        if (!ignore) setBanners(data);
      } catch (e) {
        if (!ignore) setError(e?.message || 'Failed to load hero banners');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const isCreate = !editingId;
  const isValid = Boolean(newBanner.title && (isCreate ? (newBanner._imageFile || (newBanner.imageUrlText && newBanner.imageUrlText.trim())) : true));

  const addBanner = async () => {
    if(!isValid) return;
    try {
      setLoading(true);
      if (editingId) {
        const updated = await updateHeroBanner(editingId, {
          title: newBanner.title,
          subtitle: newBanner.subtitle,
          linkUrl: newBanner.linkUrl,
          imageFile: newBanner._imageFile || undefined,
          imageUrl: (!newBanner._imageFile && newBanner.imageUrlText) ? newBanner.imageUrlText : undefined,
        });
        setBanners(prev => prev.map(b => b.id === editingId ? updated : b));
      } else {
        const created = await createHeroBanner({
          title: newBanner.title,
          subtitle: newBanner.subtitle,
          linkUrl: newBanner.linkUrl,
          imageFile: newBanner._imageFile || undefined,
          imageUrl: !newBanner._imageFile ? (newBanner.imageUrlText || undefined) : undefined,
        });
        setBanners(prev => [created, ...prev]);
      }
      setNewBanner({ title: '', subtitle:'', linkUrl:'', imagePreview:'', imageUrlText:'', _imageFile:null });
      setEditingId(null);
      setOpen(false);
    } catch (e) {
      setError(e?.message || 'Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  const removeBanner = async (id) => {
    try {
      await deleteHeroBanner(id);
      setBanners(prev => prev.filter(b=>b.id!==id));
    } catch (e) {
      setError(e?.message || 'Failed to delete banner');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if(file){
      const url = URL.createObjectURL(file);
      setNewBanner(p=>({...p, imagePreview:url, _imageFile:file, imageUrlText:'' }));
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setNewBanner({ title: '', subtitle:'', linkUrl:'', imagePreview:'', imageUrlText:'', _imageFile:null });
    setOpen(true);
  };

  const startEdit = (b) => {
    setEditingId(b.id);
    setNewBanner({
      title: b.title || '',
      subtitle: b.subtitle || '',
      linkUrl: b.linkUrl || '',
      imagePreview: b.imageUrl || '',
      imageUrlText: '',
      _imageFile: null,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Hero Banners</h2>
        <Button onClick={startCreate}>Add Banner</Button>
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {banners.map(b => (
          <Card key={b.id} className="overflow-hidden group">
            <div className="aspect-[5/3] bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <img src={b.imageUrl} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <Button variant="outline" onClick={()=>startEdit(b)}>Edit</Button>
                <Button variant="destructive" onClick={()=>removeBanner(b.id)}>Delete</Button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{b.title}</CardTitle>
              {b.subtitle && (
                <div className="text-xs text-gray-500 flex gap-2 flex-wrap">
                  <span className="truncate">{b.subtitle}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {b.linkUrl && (
                <a className="text-xs text-indigo-600 hover:underline" href={b.linkUrl} target="_blank" rel="noreferrer">{b.linkUrl}</a>
              )}
            </CardContent>
          </Card>
        ))}
        {!loading && banners.length===0 && (
          <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-xl">No banners yet</div>
        )}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title={editingId ? 'Edit Hero Banner' : 'Add Hero Banner'} actions={
        <>
          <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={addBanner} disabled={!isValid || loading} className={!isValid? 'opacity-60 cursor-not-allowed':''}>{loading? (editingId? 'Updating...':'Saving...') : (editingId? 'Update':'Save')}</Button>
        </>
      }>
        <div className="space-y-6 max-h-[70vh] pr-1 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center justify-between text-[11px] font-medium text-gray-600 mb-1">Title * {!newBanner.title && <span className="text-red-500 font-normal">Required</span>}</label>
              <Input value={newBanner.title} onChange={e=>setNewBanner(p=>({...p,title:e.target.value}))} placeholder="Banner title" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Link URL</label>
              <Input value={newBanner.linkUrl} onChange={e=>setNewBanner(p=>({...p,linkUrl:e.target.value}))} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-gray-600 mb-1">Subtitle</label>
            <Textarea rows={2} value={newBanner.subtitle} onChange={e=>setNewBanner(p=>({...p,subtitle:e.target.value}))} placeholder="Short subtitle" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center justify-between text-[11px] font-medium text-gray-600 mb-1">Upload Image {!(newBanner._imageFile || newBanner.imageUrlText) && <span className="text-red-500 font-normal">Required (file or URL)</span>}</label>
              <div onClick={()=>imageInputRef.current?.click()} className={`border-2 border-dashed rounded-md p-4 text-center text-xs cursor-pointer ${newBanner._imageFile? 'border-green-300 bg-green-50':'hover:border-gray-400 border-gray-300'}`}>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {newBanner._imageFile ? 'Replace Image' : 'Click to Upload'}
                {newBanner.imagePreview && <img src={newBanner.imagePreview} alt="preview" className="mt-2 h-24 w-24 object-cover rounded" />}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1">Or Image URL</label>
              <Input value={newBanner.imageUrlText} onChange={e=>setNewBanner(p=>({...p,imageUrlText:e.target.value, ...(p.imageUrlText && !e.target.value ? {} : {} )}))} placeholder="https://example.com/image.jpg" />
              <p className="text-[10px] text-gray-500 mt-1">If both file and URL are provided, the file will be used.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
