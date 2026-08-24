/**
 * Centralized Social Proof: Testimonials, Ratings & Client Logos (Single Source of Truth)
 * Faza Studio — East Jakarta Creative Space & Studio
 */

export const GOOGLE_REVIEWS_STATS = {
  rating: '4.9',
  maxRating: '5.0',
  totalReviews: '120+ Verified Reviews',
  badgeText: 'Top Rated Photo Studio — East Jakarta',
  googleMapsReviewUrl:
    'https://maps.google.com/?q=Jl.+Dukuh+V+No.+79,+RT.05/RW.02,+Dukuh,+Kramat+Jati,+Jakarta+Timur',
};

export const TESTIMONIALS = [
  {
    name: 'Dimas Prasetyo',
    role: 'Creative Director, Lumen Apparel',
    rating: 5,
    quote:
      'The lighting setup is exceptionally thorough—from Godox strobes to continuous modifiers. The air-conditioned private vanity made our 6-hour lookbook production run seamlessly.',
    serviceUsed: 'Product & Commercial',
  },
  {
    name: 'Sarah Nabila',
    role: 'Fashion & Digital Content Creator',
    rating: 5,
    quote:
      'The studio ambiance is pristine and peaceful. The infinity cyclorama wall is spotless, and natural light integration elevates every frame. Will definitely return for our next campaign.',
    serviceUsed: 'Editorial & Fashion',
  },
  {
    name: 'Reza Fahlevi',
    role: 'Senior Talent Acquisition, Tech Industry',
    rating: 5,
    quote:
      'Booked the Executive Portrait session for our corporate team. The posing direction and color grading were top-tier. Exceptional value for high-caliber professional branding.',
    serviceUsed: 'Executive Portrait',
  },
  {
    name: 'Nadya & Kevin',
    role: 'Private Studio Client',
    rating: 5,
    quote:
      'Rented the space for a graduation and family portrait session. Fast and courteous WhatsApp booking, complete Bluetooth audio system, and spotless private dressing rooms.',
    serviceUsed: 'Studio Rental / Hour',
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
