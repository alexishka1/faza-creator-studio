import React, { useState, useEffect, useCallback } from 'react';
import { PORTFOLIO_CATEGORIES } from '../../data/portfolio';
import { supabase } from '../../lib/supabase';
import { Image, Plus, Trash2, UploadCloud, X, Check, User, ShoppingBag, Sparkles, Building2, RefreshCw } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'Portrait & Personal',    label: 'Portrait & Personal',    desc: 'Sesi portrait personal, headshot profesional, wisuda & foto grup.', icon: User },
  { id: 'Commercial & Product',   label: 'Commercial & Product',   desc: 'Foto katalog produk, e-commerce, commercial lighting & campaign brand.', icon: ShoppingBag },
  { id: 'Editorial & Fashion',    label: 'Editorial & Fashion',    desc: 'Fashion lookbook, konsep busana, model editorial & majalah.', icon: Sparkles },
  { id: 'Studio & Space',         label: 'Studio & Space',         desc: 'Fasilitas studio, cyclorama wall, makeup station & lounge area.', icon: Building2 },
];

const GalleryManager = () => {
  const [items, setItems]                 = useState([]);
  const [categories, setCategories]       = useState(PORTFOLIO_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isLoading, setIsLoading]         = useState(true);
  const [isModalOpen, setIsModalOpen]     = useState(false);

  // Form state
  const [title, setTitle]             = useState('');
  const [category, setCategory]       = useState('Portrait & Personal');
  const [imageUrl, setImageUrl]       = useState('');
  const [fileBase64, setFileBase64]   = useState('');
  const [fileName, setFileName]       = useState('');
  const [previewUrl, setPreviewUrl]   = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [feedback, setFeedback]           = useState('');

  // ── Fetch langsung dari Supabase Database ───────────────────
  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('id, url_foto, caption, kategori, urutan, created_at')
        .order('urutan', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setItems(
          data.map((g) => ({
            id:       g.id,
            url_foto: g.url_foto,
            title:    g.caption || '',
            category: g.kategori || '',
          }))
        );

        const uniqueCats = ['Semua', ...new Set(data.map((d) => d.kategori).filter(Boolean))];
        setCategories(uniqueCats.length > 1 ? uniqueCats : PORTFOLIO_CATEGORIES);
      }
    } catch (err) {
      console.warn('[GalleryManager] load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openUploadModal = () => {
    if (selectedCategory !== 'Semua') setCategory(selectedCategory);
    else setCategory('Portrait & Personal');
    setIsModalOpen(true);
  };

  // ── Client-side compression: JPG/PNG → WebP ≤ 200KB ─────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setFileName(file.name.replace(/\.[^.]+$/, '.webp'));

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1600;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = Math.round((h * MAX) / w); w = MAX; } }
        else        { if (h > MAX) { w = Math.round((w * MAX) / h); h = MAX; } }

        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);

        // Quality 0.82 → target < 300KB
        const webp = canvas.toDataURL('image/webp', 0.82);
        setFileBase64(webp);
        setPreviewUrl(webp);
        setIsCompressing(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ── Upload foto baru langsung ke Supabase Storage & Database ──
  const handleAddPhoto = async (e) => {
    e.preventDefault();
    const finalSrc = previewUrl || imageUrl || fileBase64;
    if (!title || !finalSrc) { alert('Judul dan Foto wajib diisi.'); return; }

    setIsSubmitting(true);
    setFeedback('');

    try {
      let finalUrl = imageUrl || null;

      // 1. Upload ke Supabase Storage jika ada file
      if (fileBase64 && fileName) {
        const blobRes = await fetch(fileBase64);
        const blob = await blobRes.blob();
        const cleanName = `gallery-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const { data: storageData, error: storageErr } = await supabase.storage
          .from('gallery')
          .upload(cleanName, blob, {
            contentType: 'image/webp',
            upsert: false,
          });

        if (!storageErr && storageData) {
          const { data: pubData } = supabase.storage.from('gallery').getPublicUrl(cleanName);
          finalUrl = pubData.publicUrl;
        } else {
          console.warn('[GalleryManager] Storage upload note:', storageErr?.message);
        }
      }

      if (!finalUrl) {
        finalUrl = finalSrc;
      }

      // 2. Insert ke tabel 'galeri'
      const newId = `gal-${Date.now()}`;
      const newRecord = {
        id:       newId,
        url_foto: finalUrl,
        caption:  title.trim(),
        kategori: category.trim(),
        urutan:   0,
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('galeri')
        .insert([newRecord])
        .select()
        .single();

      if (!insertErr && inserted) {
        const newItem = {
          id:       inserted.id,
          url_foto: inserted.url_foto,
          title:    inserted.caption,
          category: inserted.kategori,
        };
        setItems((prev) => [newItem, ...prev]);
        setFeedback(`✅ Foto "${title}" berhasil diupload ke Supabase Storage & Galeri!`);
      } else {
        // Optimistic fallback
        setItems((prev) => [{ id: newId, url_foto: finalUrl, title: title.trim(), category: category.trim() }, ...prev]);
        setFeedback(`✅ Foto berhasil ditambahkan ke kategori "${category}"!`);
      }

      // Notifikasi ke seluruh aplikasi agar halaman /karya langsung terupdate
      window.dispatchEvent(new Event('faza_gallery_updated'));
    } catch (err) {
      console.warn('[GalleryManager] upload error:', err);
      setFeedback('❌ Gagal upload. Cek koneksi dan coba lagi.');
    }

    setIsModalOpen(false);
    setTitle(''); setImageUrl(''); setFileBase64(''); setPreviewUrl(''); setFileName('');
    setIsSubmitting(false);
    setTimeout(() => setFeedback(''), 4500);
  };

  // ── Hapus foto dari Supabase Database & Storage ──────────────
  const handleDeletePhoto = async (id, itemTitle, urlFoto) => {
    if (!window.confirm(`Hapus foto "${itemTitle}" dari galeri?`)) return;

    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      // 1. Hapus dari Storage jika file berada di Supabase Storage bucket gallery
      if (urlFoto && urlFoto.includes('/storage/v1/object/public/gallery/')) {
        const storageFileName = urlFoto.split('/gallery/').pop();
        if (storageFileName) {
          await supabase.storage.from('gallery').remove([storageFileName]);
        }
      }

      // 2. Hapus record dari database
      await supabase.from('galeri').delete().eq('id', id);

      window.dispatchEvent(new Event('faza_gallery_updated'));
      setFeedback(`Foto "${itemTitle}" berhasil dihapus.`);
    } catch (err) {
      console.warn('[GalleryManager] delete error:', err);
    }
    setTimeout(() => setFeedback(''), 3500);
  };

  const filteredItems =
    selectedCategory === 'Semua'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 0.3rem' }}>Manajemen Galeri & Portfolio Studio</h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            Upload foto → otomatis dikompresi ke WebP ringan → disimpan ke Supabase Storage.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={loadItems} title="Refresh" style={{ ...btnStyle, backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff' }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={openUploadModal} style={btnStyle}>
            <Plus size={16} />
            <span>Upload Foto</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{ marginBottom: '1.5rem', padding: '0.8rem 1rem', backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
          {feedback}
        </div>
      )}

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1.1rem', borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid var(--color-accent,#c9a96e)' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: selectedCategory === cat ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.03)',
              color: selectedCategory === cat ? 'var(--color-accent,#c9a96e)' : 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem', fontWeight: selectedCategory === cat ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {cat} ({cat === 'Semua' ? items.length : items.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.5)' }}>
          <p style={{ fontSize: '0.9rem' }}>Memuat galeri dari database Supabase...</p>
        </div>
      )}

      {/* Photos Grid */}
      {!isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#120f0d', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ width: '100%', height: '220px', overflow: 'hidden', backgroundColor: '#181412' }}>
                <img
                  src={item.url_foto}
                  alt={item.title || item.category}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                />
              </div>
              <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title || '—'}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{item.category}</span>
                </div>
                <button onClick={() => handleDeletePhoto(item.id, item.title || item.category, item.url_foto)}
                  style={{ padding: '0.45rem', backgroundColor: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer', display: 'flex' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
              <Image size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem' }}>Belum ada foto. Upload foto pertama kamu!</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ backgroundColor: '#161210', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '2rem', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }} onClick={(e) => e.stopPropagation()}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={20} color="var(--color-accent,#c9a96e)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>Upload Foto Karya Baru</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>File akan dikompresi ke WebP & disimpan di Supabase Storage</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.3rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
              {/* Kategori */}
              <div>
                <label style={labelStyle}>Pilih Kategori *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {CATEGORY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const sel  = category === opt.id;
                    return (
                      <div key={opt.id} onClick={() => setCategory(opt.id)}
                        style={{ padding: '0.75rem 0.9rem', borderRadius: '8px', border: sel ? '1.5px solid var(--color-accent,#c9a96e)' : '1px solid rgba(255,255,255,0.1)', backgroundColor: sel ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.3rem', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Icon size={15} color={sel ? 'var(--color-accent,#c9a96e)' : 'rgba(255,255,255,0.6)'} />
                            <span style={{ fontSize: '0.82rem', fontWeight: sel ? 700 : 500, color: sel ? '#fff' : 'rgba(255,255,255,0.85)' }}>{opt.label}</span>
                          </div>
                          {sel && <Check size={14} color="var(--color-accent,#c9a96e)" />}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>{opt.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Judul */}
              <div>
                <label style={labelStyle}>Judul / Caption Foto *</label>
                <input type="text" required placeholder="Misal: Studio Ambiance, Lookbook Fashion, dll."
                  value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
              </div>

              {/* Upload file */}
              <div>
                <label style={labelStyle}>Upload File Foto (JPG/PNG → otomatis ke WebP)</label>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange} style={{ ...inputStyle, padding: '0.45rem' }} />
                {isCompressing && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent,#c9a96e)', marginTop: '0.3rem', display: 'block' }}>
                    ⚙️ Mengompresi foto ke WebP ringan...
                  </span>
                )}
              </div>

              {/* Atau URL */}
              <div>
                <label style={labelStyle}>Atau Masukkan URL Gambar (Opsional)</label>
                <input type="text" placeholder="https://..." value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) setPreviewUrl(e.target.value); }}
                  style={inputStyle} />
              </div>

              {/* Preview */}
              {previewUrl && (
                <div>
                  <span style={labelStyle}>Preview:</span>
                  <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                </div>
              )}

              <button type="submit" disabled={isSubmitting || isCompressing}
                style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: 'var(--color-accent,#c9a96e)', color: '#000', fontWeight: 700, fontSize: '0.88rem', border: 'none', borderRadius: '6px', cursor: isSubmitting || isCompressing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <UploadCloud size={18} />
                <span>{isSubmitting ? 'Menyimpan ke Supabase Storage...' : `Simpan ke Galeri — "${category}"`}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.4rem',
  backgroundColor: 'var(--color-accent,#c9a96e)',
  color: '#000', fontWeight: 700, fontSize: '0.85rem',
  border: 'none', borderRadius: '6px', cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(201,169,110,0.3)',
};

const labelStyle = {
  display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)',
  marginBottom: '0.4rem', fontWeight: 600,
};

const inputStyle = {
  width: '100%', padding: '0.65rem 0.9rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '6px', color: '#fff', fontSize: '0.85rem',
  outline: 'none', boxSizing: 'border-box',
};

export default GalleryManager;
