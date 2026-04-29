'use client';

interface HeroProps {
  data: {
    businessName: string;
    heroHeadline: string;
    heroSubtext: string;
    tagline: string;
    ctaText: string;
    phone: string;
    photos: string[];
    colorPalette: { primary: string; secondary: string; accent: string };
  };
}

export default function Hero({ data }: HeroProps) {
  const bgImage = data.photos?.[0];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      style={{ backgroundColor: data.colorPalette.primary }}
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-75">{data.tagline}</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">{data.heroHeadline}</h1>
        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">{data.heroSubtext}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="#contact"
            className="px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: data.colorPalette.accent, color: '#fff' }}
          >
            {data.ctaText}
          </a>
          {data.phone && (
            <a
              href={`tel:${data.phone}`}
              className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/50 hover:border-white transition-colors"
            >
              Call {data.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
