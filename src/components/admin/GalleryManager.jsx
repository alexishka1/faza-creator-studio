import React, { useState, useEffect } from 'react';
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES } from '../../data/portfolio';
import { supabase } from '../../lib/supabase';
import { Image, Plus, Trash2, Tag, UploadCloud, AlertCircle, X, Check } from 'lucide-react';

const GalleryManager = () => {
  const [items, setItems] = useState(PORTFOLIO_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Portrait');
  const [imageUrl, setImageUrl] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadAllGalleryItems = async () => {
    // 1. Get stored items from localStorage
    let localCustom = [];
    try {
      const saved = localStorage.getItem('faza_custom_gallery');
      if (saved) localCustom = JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    // 2. Fetch from Supabase database if available
    let dbItems = [];
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbItems = data.map((g) => ({
          id: g.id,
          title: g.title,
          category: g.category,
          desktopSrc: g.desktop_src,
          mobileSrc: g.mobile_src,
          isCustom: true,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch error, using local data:', e);
    }

    // Merge: DB items + LocalStorage custom items + Default Portfolio
    const combinedCustom = [...dbItems];
    localCustom.forEach((loc) => {
      if (!combinedCustom.some((c) => c.id === loc.id)) {
        combinedCustom.push(loc);
      }
    });

    const finalMerged = [
      ...combinedCustom,
      ...PORTFOLIO_ITEMS.filter((def) => !combinedCustom.some((c) => String(c.id) === String(def.id))),
    ];

    setItems(finalMerged);
  };

  useEffect(() => {
    loadAllGalleryItems();

    const handleUpdate = () => loadAllGalleryItems();
    window.addEventListener('faza_gallery_updated', handleUpdate);
    return () => window.removeEventListener('faza_gallery_updated', handleUpdate);
  }, []);

  // Client-side Image Compression to lightweight WebP (~150-250KB)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP with 0.82 quality
        const webpDataUrl = canvas.toDataURL('image/webp', 0.82);
        setFileBase64(webpDataUrl);
        setPreviewUrl(webpDataUrl);
        setIsCompressing(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    const finalPhotoSrc = previewUrl || imageUrl || fileBase64;
    if (!title || !finalPhotoSrc) {
      alert('Judul dan Foto wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    const newPhotoItem = {
      id: `gal-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      desktopSrc: finalPhotoSrc,
      mobileSrc: finalPhotoSrc,
      isCustom: true,
      created_at: new Date().toISOString(),
    };

    // 1. Save to Supabase (if online)
    try {
      await supabase.from('galeri').insert([
        {
          id: newPhotoItem.id,
          title: newPhotoItem.title,
          category: newPhotoItem.category,
          desktop_src: newPhotoItem.desktopSrc,
          mobile_src: newPhotoItem.mobileSrc,
          order_index: 0,
          created_at: newPhotoItem.created_at,
        },
      ]);
    } catch (dbErr) {
      console.warn('Supabase insert note (continuing with local cache):', dbErr);
    }

    // 2. Save to LocalStorage persistence
    try {
      const saved = localStorage.getItem('faza_custom_gallery');
      const current = saved ? JSON.parse(saved) : [];
      const updated = [newPhotoItem, ...current.filter((c) => c.id !== newPhotoItem.id)];
      localStorage.setItem('faza_custom_gallery', JSON.stringify(updated));
    } catch (storageErr) {
      console.warn('Storage save note:', storageErr);
    }

    // 3. Notify app components (e.g. /karya)
    window.dispatchEvent(new Event('faza_gallery_updated'));

    // 4. Update local state
    setItems((prev) => [newPhotoItem, ...prev]);
    setFeedback('✅ Foto berhasil ditambahkan ke database & galeri!');
    setIsModalOpen(false);
    setTitle('');
    setImageUrl('');
    setFileBase64('');
    setPreviewUrl('');
    setFileName('');
    setIsSubmitting(false);
    setTimeout(() => setFeedback(''), 4500);
  };

  const handleDeletePhoto = async (id, itemTitle) => {
    if (!window.confirm(`Hapus foto "${itemTitle}" dari galeri website?`)) return;

    // 1. Remove from local state
    setItems((prev) => prev.filter((item) => item.id !== id));

    // 2. Remove from LocalStorage
    try {
      const saved = localStorage.getItem('faza_custom_gallery');
      if (saved) {
        const current = JSON.parse(saved);
        const updated = current.filter((c) => c.id !== id);
        localStorage.setItem('faza_custom_gallery', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('LocalStorage remove error:', e);
    }

    // 3. Remove from Supabase DB
    try {
      await supabase.from('galeri').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    // 4. Notify app
    window.dispatchEvent(new Event('faza_gallery_updated'));
    setFeedback(`Foto "${itemTitle}" berhasil dihapus.`);
    setTimeout(() => setFeedback(''), 3500);
  };

  const filteredItems =
    selectedCategory === 'Semua'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Top Header & Add Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 0.3rem' }}>
            Manajemen Galeri & Portfolio Studio
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
            Upload dan kelola foto karya terbaru. Foto otomatis dikonversi ke WebP ringan (~150KB) agar website tidak berat.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.4rem',
            backgroundColor: 'var(--color-accent, #c9a96e)',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
          }}
        >
          <Plus size={16} />
          <span>Upload Foto Baru</span>
        </button>
      </div>

      {feedback && (
        <div style={{ marginBottom: '1.5rem', padding: '0.8rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
          {feedback}
        </div>
      )}

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {PORTFOLIO_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid var(--color-accent, #c9a96e)' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: selectedCategory === cat ? 'rgba(201, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === cat ? 'var(--color-accent, #c9a96e)' : 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.78rem',
              fontWeight: selectedCategory === cat ? 600 : 500,
              cursor: 'pointer',
            }}
          >
            {cat} ({cat === 'Semua' ? items.length : items.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Photos Grid Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#120f0d',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          >
            {/* Image Box */}
            <div style={{ width: '100%', height: '260px', position: 'relative', overflow: 'hidden', backgroundColor: '#181412' }}>
              <img
                src={item.desktopSrc || item.mobileSrc}
                alt={item.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '0.6rem',
                  left: '0.6rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(4px)',
                  color: 'var(--color-accent, #c9a96e)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {item.category}
              </span>
            </div>

            {/* Info & Delete Action */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </p>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                  ID: {item.id}
                </span>
              </div>

              <button
                onClick={() => handleDeletePhoto(item.id, item.title)}
                title="Hapus Foto"
                style={{
                  padding: '0.45rem',
                  backgroundColor: 'rgba(248, 113, 113, 0.15)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '6px',
                  color: '#f87171',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal Form Upload Foto Baru ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#161210',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud size={20} color="var(--color-accent, #c9a96e)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>Upload Foto Galeri Baru</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Judul / Label Foto *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Lookbook Fashion Editorial Vol. 4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Kategori Galeri *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Ruang & Studio">Ruang & Studio</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Pilih File Foto dari Perangkat (Otomatis Kompres ke WebP Ringan)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  style={{ ...inputStyle, padding: '0.45rem' }}
                />
                {isCompressing && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent, #c9a96e)', marginTop: '0.3rem', display: 'block' }}>
                    ⚙️ Mengompres foto ke format WebP ringan...
                  </span>
                )}
              </div>

              <div>
                <label style={labelStyle}>Atau Masukkan URL Gambar (Opsional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value) setPreviewUrl(e.target.value);
                  }}
                  style={inputStyle}
                />
              </div>

              {/* Live Preview */}
              {previewUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={labelStyle}>Preview Foto:</span>
                  <div style={{ width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isCompressing}
                style={{
                  marginTop: '0.8rem',
                  padding: '0.85rem',
                  backgroundColor: 'var(--color-accent, #c9a96e)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isSubmitting || isCompressing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <UploadCloud size={18} />
                <span>{isSubmitting ? 'Menyimpan ke Database...' : 'Simpan & Publikasikan'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  color: 'rgba(255, 255, 255, 0.75)',
  marginBottom: '0.4rem',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default GalleryManager;
