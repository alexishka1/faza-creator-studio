/**
 * Centralized Social Proof: Testimonials, Ratings & Client Logos (Single Source of Truth)
 * Faza Studio — Jakarta Timur
 */

export const GOOGLE_REVIEWS_STATS = {
  rating: '4.9',
  maxRating: '5.0',
  totalReviews: '120+',
  badgeText: 'Top Rated Photo Studio — Jakarta Timur',
  googleMapsReviewUrl:
    'https://maps.google.com/?q=Jl.+Dukuh+V+No.+79,+RT.05/RW.02,+Dukuh,+Kramat+Jati,+Jakarta+Timur',
};

export const TESTIMONIALS = [
  {
    name: 'Dimas Prasetyo',
    role: 'Creative Director, Local Brand Apparel',
    rating: 5,
    quote:
      'Lighting setup-nya lengkap banget dari Godox sampai continuous light, AC dingin, dan ada ruang ganti private. Sesi photoshoot katalog 6 jam berjalan super lancar!',
    serviceUsed: 'Product & Commercial',
  },
  {
    name: 'Sarah Nabila',
    role: 'Fashion Content Creator',
    rating: 5,
    quote:
      'Lokasi studio di Ciracas gampang diakses. Cyclorama wall-nya bersih dan ambiencenya tenang banget, bikin mood foto jadi dapet. Pasti bakal balik lagi.',
    serviceUsed: 'Editorial & Fashion',
  },
  {
    name: 'Reza Fahlevi',
    role: 'Corporate HR & Professional',
    rating: 5,
    quote:
      'Ambil paket LinkedIn Portrait bareng tim kantor. Hasil grading dan arahan posenya sangat profesional. Worth it banget untuk harga terjangkau.',
    serviceUsed: 'LinkedIn Portrait',
  },
  {
    name: 'Nadya & Kevin',
    role: 'Personal Portrait Client',
    rating: 5,
    quote:
      'Sewa studio per jam buat sesi foto wisuda & keluarga. Adminnya ramah, responsif via WhatsApp, dan fasilitasnya lengkap sampai Bluetooth speaker!',
    serviceUsed: 'Studio Rent / Jam',
  },
];

export const CLIENT_LOGOS = [
  'LUMEN APPAREL',
  'STUDIO EIGHT',
  'NOIR ARCHIVE',
  'METROPOLITAN MEDIA',
  'AURORA BRAND',
  'KREASI CO.',
];

export default {
  GOOGLE_REVIEWS_STATS,
  TESTIMONIALS,
  CLIENT_LOGOS,
};
