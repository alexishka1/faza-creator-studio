/**
 * Centralized Contact & Studio Information (Single Source of Truth)
 * Faza Studio — East Jakarta Creative Space & Studio
 */

export const STUDIO_INFO = {
  name: 'FAZA STUDIO',
  brandShort: 'FAZA',
  tagline: 'Creative Space & Photo Studio — East Jakarta',
  description:
    'Modern creative space and photography studio in East Jakarta designed for commercial advertising, fashion lookbooks, executive portraits, podcast productions, and flexible venue hire.',

  // WhatsApp & Phone
  phone: '0813-8956-0707',
  phoneFormatted: '+62 813-8956-0707',
  phoneRaw: '6281389560707',
  defaultWaMessage:
    'Hello Faza Studio, I would like to inquire about studio rental rates and schedule availability.',

  // Location & Address
  address:
    '(Grand Dukuh Indah) Jl. Penggilingan Baru I Blok K-3, RT 014/004, Kel. Dukuh, Kec. Kramat Jati, Jak-Tim, 13550',
  addressShort: 'Kramat Jati, Jakarta Timur',
  mapsDirectUrl:
    'https://www.google.com/maps/search/?api=1&query=(Grand+Dukuh+Indah)+Jl.+Penggilingan+Baru+I+Blok+K-3+RT+014+004+Dukuh+Kramat+Jati+Jakarta+Timur+13550',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=(Grand+Dukuh+Indah)+Jl.+Penggilingan+Baru+I+Blok+K-3,+RT+014/004,+Kel.+Dukuh,+Kec.+Kramat+Jati,+Jak-Tim,+13550&output=embed',

  // Operating Hours
  operatingHours: 'Monday – Sunday: 09:00 AM – 09:00 PM WIB',
  operatingHoursNote: 'Advance Schedule Reservation Required',

  // Social & Online Contact
  email: 'fazastudioo@gmail.com',
  instagramHandle: '@fazastudioo',
  instagramUrl: 'https://instagram.com/fazastudioo',
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
