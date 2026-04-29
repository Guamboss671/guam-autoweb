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
    <main style={{ '--color-primary': data.colorPalette.primary, '--color-secondary': data.colorPalette.secondary, '--color-accent': data.colorPalette.accent } as React.CSSProperties}>
      {isPreview && <PreviewBanner businessName={data.businessName} />}
      <Hero data={data} />
      <Services services={data.services} />
      <About aboutText={data.aboutText} businessName={data.businessName} />
      <Gallery photos={data.photos} businessName={data.businessName} />
      <Testimonials reviews={data.reviews} />
      <Contact lead={data} />
    </main>
  );
}
