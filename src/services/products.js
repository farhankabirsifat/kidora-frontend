import { apiClient } from './apiClient';
import { getBasicCreds } from './auth';

const base = '/api/products';

function toFullUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiClient.base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function listProducts({ page = 0, size = 50, category, search } = {}) {
  const basic = getBasicCreds();
  const params = new URLSearchParams({ page, size });
  if (category) {
    const catValue = Array.isArray(category) ? category.join(',') : category;
    params.set('category', catValue);
  }
  if (search) params.set('search', search);
  // Use trailing slash to avoid 307 redirect from FastAPI when router path is '/'
  return apiClient.get(`${base}/?${params.toString()}`, { auth: { basic } });
}

export async function listProductsByCategory(category, { page = 0, size = 50 } = {}) {
  if (!category || (Array.isArray(category) && category.length === 0)) return [];
  return listProducts({ page, size, category });
}

export async function listCategories() {
  // public endpoint
  return apiClient.get(`${base}/categories`);
}

export async function listCategoryCounts() {
  // public endpoint
  return apiClient.get(`${base}/category-counts`);
}

export async function createProduct({ title, description, price, category, rating = 0, discount = 0, mainImageFile, imageFiles = [], sizes, video, freeShipping = false } = {}) {
  const basic = getBasicCreds();
  const fd = new FormData();
  fd.append('title', title);
  if (description) fd.append('description', description);
  fd.append('price', String(price));
  fd.append('category', category || 'uncategorized');
  fd.append('rating', String(rating ?? 0));
  fd.append('discount', String(discount ?? 0));
  if (sizes && typeof sizes === 'object') {
    try { fd.append('sizes_stock', JSON.stringify(sizes)); } catch {}
  }
  if (video) fd.append('video', video);
  fd.append('free_shipping', String(Boolean(freeShipping)));
  fd.append('mainImage', mainImageFile);
  for (const f of imageFiles) fd.append('images', f);
  return apiClient.post(`${base}/admin`, fd, { auth: { basic } });
}

export async function updateProduct(id, { title, description, price, category, rating, discount, mainImageFile, imageFiles, sizes, video, freeShipping } = {}) {
  const basic = getBasicCreds();
  const fd = new FormData();
  if (title !== undefined) fd.append('title', title);
  if (description !== undefined) fd.append('description', description ?? '');
  if (price !== undefined) fd.append('price', String(price));
  if (category !== undefined) fd.append('category', category || 'uncategorized');
  if (rating !== undefined) fd.append('rating', String(rating ?? 0));
  if (discount !== undefined) fd.append('discount', String(discount ?? 0));
  if (sizes && typeof sizes === 'object') {
    try { fd.append('sizes_stock', JSON.stringify(sizes)); } catch {}
  }
  if (video !== undefined) fd.append('video', video ?? '');
  if (freeShipping !== undefined) fd.append('free_shipping', String(Boolean(freeShipping)));
  if (mainImageFile) fd.append('main_image', mainImageFile);
  if (Array.isArray(imageFiles)) {
    for (const f of imageFiles) fd.append('images', f);
  }
  return apiClient.put(`${base}/admin/${id}`, fd, { auth: { basic } });
}

export async function deleteProduct(id) {
  const basic = getBasicCreds();
  return apiClient.del(`${base}/${id}`, { auth: { basic } });
}

export async function listLowStock({ threshold = 10 } = {}) {
  const basic = getBasicCreds();
  const params = new URLSearchParams({ threshold });
  return apiClient.get(`${base}/low-stock?${params.toString()}`, { auth: { basic } });
}

export function mapProductOutToUi(p) {
  const primary = p.main_image || p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "");
  const images = Array.isArray(p.images) ? p.images : [];
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    stock: p.stock,
    category: p.category,
    description: p.description,
    rating: p.rating ?? 0,
    discount: p.discount ?? 0,
    video: p.video || '',
    sizes: p.sizes_stock || null,
    freeShipping: p.free_shipping || false,
    image: toFullUrl(primary),
    images: images.map(toFullUrl),
    _raw: p,
  };
}

export async function getProductById(id) {
  // Public endpoint
  return apiClient.get(`${base}/${id}`);
}
