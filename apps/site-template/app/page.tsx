import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import PreviewBanner from '../components/PreviewBanner';
import { getSiteData } from '../lib/site-data';

export default function SitePage() {
  const data = getSiteData();
  const isPreview = process.env.SITE_STATUS === 'preview';

  return (
    <main>
      {isPreview && <PreviewBanner businessName={data.businessName} />}
      <Hero data={data} />
      <Services services={data.services} colorPalette={data.colorPalette} />
      <About aboutText={data.aboutText} businessName={data.businessName} colorPalette={data.colorPalette} />
      <Gallery photos={data.photos} businessName={data.businessName} />
      <Testimonials reviews={data.reviews} colorPalette={data.colorPalette} />
      <Contact lead={data} />
    </main>
  );
}
