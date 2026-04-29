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
  const bg = data.photos?.[0];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: data.colorPalette.primary }}
    >
      {/* Background image or gradient overlay */}
      {bg ? (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
          <div className="absolute inset-0" style={{ backgroundColor: data.colorPalette.primary, opacity: 0.75 }} />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
            style={{ backgroundColor: data.colorPalette.accent }}
          />
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10 -translate-x-1/3 -translate-y-1/3"
            style={{ backgroundColor: data.colorPalette.secondary }}
          />
        </>
      )}

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-6 px-4 py-2 rounded-full border border-white/30 text-white/80">
          {data.tagline}
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-sm">
          {data.heroHeadline}
        </h1>
        <p className="text-xl md:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
          {data.heroSubtext}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: data.colorPalette.accent, color: '#fff' }}
          >
            {data.ctaText}
          </a>
          {data.phone ? (
            <a
              href={`tel:${data.phone}`}
              className="px-10 py-4 rounded-full font-bold text-lg text-white border-2 border-white/50 hover:bg-white/10 transition-all"
            >
              Call {data.phone}
            </a>
          ) : (
            <a
              href="#services"
              className="px-10 py-4 rounded-full font-bold text-lg text-white border-2 border-white/50 hover:bg-white/10 transition-all"
            >
              See Our Services
            </a>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-white/30" />
      </div>
    </section>
  );
}
