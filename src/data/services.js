// Centralized source of truth for all Faza Studio packages & pricing (English)

export const B2C_SERVICES = [
  {
    id: 'studio-rent',
    title: 'Studio Rental',
    subtitle: '/ Hour',
    price: 'IDR 150,000 – 250,000',
    tag: 'RETAIL / HOURLY',
    desc: 'Flexible private studio rental with professional continuous & strobe lighting, interchangeable cyclorama backdrops, and air-conditioned dressing rooms.',
    features: ['Professional Lighting Setup Included', 'Cyclorama & Seamless Backdrops', 'Air-Conditioned & Private Vanity', 'Minimum 1-Hour Booking'],
    desktopImg: '/images/optimized/DSCF9516-1600.webp',
    mobileImg: '/images/optimized/DSCF9516-800.webp',
  },
  {
    id: 'happy-hour',
    title: 'Weekday',
    subtitle: 'Happy Hour',
    price: 'IDR 499,000',
    tag: 'POPULAR DEAL',
    desc: 'Exclusive value studio package for weekday sessions (Monday–Thursday). Ideal for content creators, graduation portraits, and personal projects.',
    features: ['2-Hour Complete Studio Access', 'All High-Res Raw Files Provided', '5 Curated Edited Photos', 'Up to 4 Persons Included'],
    desktopImg: '/images/optimized/DSCF9527-1600.webp',
    mobileImg: '/images/optimized/DSCF9527-800.webp',
  },
  {
    id: 'together-moment',
    title: 'Together',
    subtitle: 'Moment',
    price: 'IDR 699,000',
    tag: 'BEST FOR GROUPS',
    desc: 'Capture timeless group memories for families, graduation cohorts, best friends, and creative teams with aesthetic and directed studio compositions.',
    features: ['2-Hour Directed Studio Session', 'Capacity Up to 8 Persons', '10 Premium Retouched Photos', 'Instant Cloud Drive Gallery Access'],
    desktopImg: '/images/optimized/DSCF9518-1600.webp',
    mobileImg: '/images/optimized/DSCF9518-800.webp',
  },
  {
    id: 'linkedin-portrait',
    title: 'Executive',
    subtitle: 'Portrait',
    price: 'IDR 150,000',
    tag: 'CAREER & PROFILE',
    desc: 'Fast, sharp, and commanding executive headshots engineered to elevate your LinkedIn profile, corporate bio, and personal brand presence.',
    features: ['30-Minute Focused Headshot Session', 'Curated Aesthetic Backdrop Selection', '3 Master-Retouched High-Res Photos', 'Express 24-48h Delivery'],
    desktopImg: '/images/optimized/DSCF9520-1600.webp',
    mobileImg: '/images/optimized/DSCF9520-800.webp',
  },
];

export const B2B_SERVICES = [
  {
    id: 'editorial-fashion',
    title: 'Editorial',
    subtitle: '& Fashion',
    price: 'IDR 5,000,000',
    tag: 'COMMERCIAL PRODUCTION',
    desc: 'High-end commercial photoshoot designed for fashion brands, lookbooks, and magazine editorials. Includes creative direction and complex multi-light setups.',
    features: ['Creative Direction & Concept Board', 'Full Studio Lighting Architecture', '80 High-End Retouched Images', 'Full Commercial Usage License'],
    desktopImg: '/images/optimized/DSCF9524-1600.webp',
    mobileImg: '/images/optimized/DSCF9524-800.webp',
  },
  {
    id: 'product-commercial',
    title: 'Product',
    subtitle: '& Commercial',
    price: 'IDR 2,000,000',
    tag: 'BRAND & CATALOG',
    desc: 'Sharp, texture-accurate product photography with specialized tabletop and lifestyle setups tailored for e-commerce, digital advertising, and marketplace storefronts.',
    features: ['Up to 30 Product SKUs', 'Clean White / Dark / Styled Setup', '40 Ready-to-Use Master Edits', 'Ultra High-Res Print-Ready Files'],
    desktopImg: '/images/optimized/DSCF9515-1600.webp',
    mobileImg: '/images/optimized/DSCF9515-800.webp',
  },
  {
    id: 'sewa-ruang',
    title: 'Space Buyout',
    subtitle: 'Half-Day / Full-Day',
    price: 'IDR 1,200,000 – 2,000,000',
    tag: 'VENUE PRODUCTION',
    desc: 'Exclusive private buyout of the entire creative space for video commercials, film shoots, casting calls, creative workshops, and brand launches.',
    features: ['Half-Day (4h) / Full-Day (8h) Options', 'Full Access to Cyclorama & Lounge', 'High-Capacity Power & High-Speed WiFi', 'Dedicated Makeup & Client Holding Area'],
    desktopImg: '/images/optimized/DSCF9516-1600.webp',
    mobileImg: '/images/optimized/DSCF9516-800.webp',
  },
  {
    id: 'podcast-bundle',
    title: 'Podcast',
    subtitle: 'Bundle',
    price: 'IDR 850,000',
    tag: 'AUDIO & TALKSHOW',
    desc: 'Turnkey studio setup for video podcasts, vodcasts, and talkshows equipped with multi-microphone audio capture and cinematic ambient lighting.',
    features: ['2-Hour Sound-Treated Recording Block', '2-3 Pro Broadcast Microphones & Mixer', 'Cinematic Studio Lighting Atmosphere', 'Immediate Raw Multi-Track Audio & Video'],
    desktopImg: '/images/optimized/DSCF9527-1600.webp',
    mobileImg: '/images/optimized/DSCF9527-800.webp',
  },
  {
    id: 'retainer-bulanan',
    title: 'Monthly',
    subtitle: 'Retainer',
    price: 'From IDR 4,500,000 / mo',
    tag: 'AGENCY PARTNERSHIP',
    desc: 'Ongoing visual production partnership for agencies and active brands. Includes flexible monthly studio hours, prioritized calendar booking, and dedicated creative support.',
    features: ['Flexible Monthly Studio Hours Pool', 'Priority Calendar Scheduling Anytime', 'Dedicated Photographer & Editor Team', 'Cost-Optimized Production Volume'],
    desktopImg: '/images/optimized/DSCF9518-1600.webp',
    mobileImg: '/images/optimized/DSCF9518-800.webp',
  },
];

export const ALL_SERVICES = [...B2C_SERVICES, ...B2B_SERVICES];

export const LAYANAN_OPTIONS = [
  // B2C Retail
  { value: 'Studio Rental / Hour', label: 'Studio Rental / Hour (IDR 150k – 250k)' },
  { value: 'Weekday Happy Hour', label: 'Weekday Happy Hour (IDR 499,000)' },
  { value: 'Together Moment', label: 'Together Moment (IDR 699,000)' },
  { value: 'Executive Portrait', label: 'Executive Portrait (IDR 150,000)' },
  // B2B Creative Space
  { value: 'Editorial & Fashion', label: 'Editorial & Fashion (IDR 5,000,000)' },
  { value: 'Product & Commercial', label: 'Product & Commercial (IDR 2,000,000)' },
  { value: 'Space Buyout Half / Full-Day', label: 'Space Buyout Half / Full-Day (IDR 1.2M – 2M)' },
  { value: 'Podcast Bundle', label: 'Podcast Bundle (IDR 850,000)' },
  { value: 'Monthly Retainer', label: 'Monthly Retainer (From IDR 4.5M/mo)' },
];

export default {
  B2C_SERVICES,
  B2B_SERVICES,
  ALL_SERVICES,
  LAYANAN_OPTIONS,
};
