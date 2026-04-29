// Injected at build time by the site-builder agent via Vercel env vars
export function getSiteData() {
  const raw = process.env.SITE_DATA;
  const siteData = raw ? JSON.parse(raw) : {};

  return {
    businessName: process.env.BUSINESS_NAME ?? 'Local Business',
    siteId: process.env.SITE_ID ?? '',
    phone: process.env.BUSINESS_PHONE ?? '',
    email: process.env.BUSINESS_EMAIL ?? '',
    address: process.env.BUSINESS_ADDRESS ?? 'Guam',
    photos: process.env.BUSINESS_PHOTOS ? JSON.parse(process.env.BUSINESS_PHOTOS) : [],
    reviews: process.env.BUSINESS_REVIEWS ? JSON.parse(process.env.BUSINESS_REVIEWS) : [],
    ...siteData,
  };
}
