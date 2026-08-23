/**
 * Centralized Contact & Studio Information (Single Source of Truth)
 * Faza Studio — Jakarta Timur
 */

export const STUDIO_INFO = {
  name: 'FAZA STUDIO',
  brandShort: 'FAZA',
  tagline: 'Creative Space & Photo Studio — Jakarta Timur',
  description:
    'Studio foto & creative space modern di Jakarta Timur untuk kebutuhan komersial, fashion, portrait, podcast, dan sewa ruang produksi fleksibel.',

  // WhatsApp & Phone
  phone: '+62 859-3358-5829',
  phoneRaw: '6285933585829',
  defaultWaMessage:
    'Halo Faza Studio, saya mau tanya-tanya soal sewa studio dan paket foto.',

  // Location & Address
  address:
    'Jl. Dukuh V No. 79, RT.05/RW.02, Dukuh, Kec. Kramat Jati / Ciracas, Jakarta Timur, DKI Jakarta 13550',
  addressShort: 'Ciracas / Kramat Jati, Jakarta Timur',
  mapsDirectUrl:
    'https://maps.google.com/?q=Jl.+Dukuh+V+No.+79,+RT.05/RW.02,+Dukuh,+Kramat+Jati,+Jakarta+Timur',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7725942467775!2d106.8718917!3d-6.2935919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f298811e74f1%3A0x6b1076b4a2c0211!2sJl.%20Dukuh%20V%20No.79%2C%20RT.5%2FRW.2%2C%20Dukuh%2C%20Kec.%20Kramat%20jati%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2013550!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',

  // Operating Hours
  operatingHours: 'Senin – Minggu: 09.00 – 21.00 WIB',
  operatingHoursNote: 'Berdasarkan Reservasi Jadwal Terlebih Dahulu',

  // Social & Online Contact
  email: 'dewadp08@gmail.com',
  instagramHandle: '@fazastudio',
  instagramUrl: 'https://instagram.com/fazastudio',
};

/**
 * Generate a WhatsApp chat URL with optional custom message
 * @param {string} [customMsg]
 * @returns {string}
 */
export const getWhatsAppUrl = (customMsg) => {
  const msg = customMsg || STUDIO_INFO.defaultWaMessage;
  return `https://wa.me/${STUDIO_INFO.phoneRaw}?text=${encodeURIComponent(msg)}`;
};

export default STUDIO_INFO;
