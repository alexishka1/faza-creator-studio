import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Booking = () => {
  return (
    <PageTransition>
      <div style={{ background: 'var(--color-bg)', color: '#fff', minHeight: '100vh', paddingTop: '20vh', paddingBottom: '10vh' }}>
        
        <div style={{ width: '90%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          
          {/* Left Column: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ flex: '1 1 400px' }}
          >
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Inquiries
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
              LET'S CREATE<br/>TOGETHER.
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '80%' }}>
              Ceritakan visi Anda, dan biarkan kami yang mewujudkannya melalui lensa kamera. Isi formulir di samping atau hubungi kami secara langsung.
            </p>

            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>Studio Kami</h4>
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>Jl. Kemang Raya No. 12A<br/>Jakarta Selatan, 12730</p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>Kontak Langsung</h4>
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>hello@fazastudio.com</p>
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>+62 812 3456 7890</p>
            </div>

            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem 2.5rem',
                background: '#fff',
                color: '#000',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                borderRadius: '50px',
                transition: 'transform 0.3s ease, background 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = '#ddd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#fff';
              }}
            >
              Chat via WhatsApp
            </a>
          </motion.div>

          {/* Right Column: Elegant Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ flex: '1 1 500px', background: '#0a0a0a', padding: '4rem', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
              <div className="form-group" style={{ position: 'relative' }}>
                <input type="text" placeholder="Nama Lengkap" required style={inputStyle} />
              </div>
              
              <div className="form-group" style={{ position: 'relative' }}>
                <input type="email" placeholder="Alamat Email" required style={inputStyle} />
              </div>
              
              <div className="form-group" style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <select style={{...inputStyle, cursor: 'none'}} required defaultValue="">
                    <option value="" disabled hidden>Pilih Layanan</option>
                    <option value="wedding" style={{background: '#000'}}>Pre-Wedding & Wedding</option>
                    <option value="commercial" style={{background: '#000'}}>Commercial & Product</option>
                    <option value="portrait" style={{background: '#000'}}>Personal Portrait</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <input type="date" style={{...inputStyle, color: 'rgba(255,255,255,0.5)', cursor: 'none'}} />
                </div>
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <textarea rows="4" placeholder="Ceritakan detail proyek atau acara Anda..." style={{...inputStyle, resize: 'none'}} required></textarea>
              </div>

              <button 
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '1.2rem 3rem',
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontSize: '0.8rem',
                  cursor: 'none',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                Kirim Permintaan
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  fontSize: '1rem',
  padding: '1rem 0',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.3s',
};

export default Booking;
