import { ApifyClient } from 'apify-client';
import { upsertLead } from '../../db/queries/leads.js';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const GUAM_CATEGORIES = [
  'restaurants in Guam',
  'auto repair Guam',
  'hair salon Guam',
  'dental clinic Guam',
  'retail store Guam',
  'plumber Guam',
  'electrician Guam',
  'hotel Guam',
  'tattoo shop Guam',
  'gym fitness Guam',
  'bakery Guam',
  'florist Guam',
  'photographer Guam',
  'real estate Guam',
  'insurance Guam',
];

export async function scrapeGoogleMaps(query: string) {
  console.log(`[LeadDiscovery] Scraping: ${query}`);

  const run = await client.actor('compass/crawler-google-places').call({
    searchStringsArray: [query],
    maxCrawledPlacesPerSearch: 100,
    language: 'en',
    maxReviews: 5,
    includeHistogram: false,
    includeOpeningHours: true,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  let saved = 0;

  for (const place of items as any[]) {
    try {
      await upsertLead({
        business_name: place.title,
        category: place.categoryName,
        address: place.address,
        phone: place.phone,
        website: place.website ?? null,
        google_maps_url: place.url,
        hours: place.openingHours ?? null,
        photos: (place.imageUrls ?? []).slice(0, 5),
        reviews: (place.reviews ?? []).slice(0, 3),
        source: 'google_maps',
      });
      saved++;
    } catch (err) {
      console.error(`[LeadDiscovery] Failed to save ${place.title}:`, err);
    }
  }

  console.log(`[LeadDiscovery] Saved ${saved}/${items.length} leads from "${query}"`);
  return saved;
}

export async function scrapeAllCategories() {
  let total = 0;
  for (const query of GUAM_CATEGORIES) {
    total += await scrapeGoogleMaps(query);
    // Respectful delay between requests
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log(`[LeadDiscovery] Total leads saved: ${total}`);
  return total;
}
