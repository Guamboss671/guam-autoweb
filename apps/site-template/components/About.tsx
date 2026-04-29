export default function About({ aboutText, businessName, colorPalette }: {
  aboutText: string;
  businessName: string;
  colorPalette: { primary: string; secondary: string; accent: string };
}) {
  const paragraphs = aboutText?.split('\n\n').filter(Boolean) ?? [];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Decorative left panel */}
          <div className="relative">
            <div className="rounded-3xl h-80 lg:h-full min-h-64 flex items-center justify-center"
              style={{ backgroundColor: colorPalette.primary }}
            >
              <div className="text-center text-white px-8">
                <div className="text-7xl font-black opacity-20 select-none leading-none">
                  {businessName.charAt(0)}
                </div>
                <p className="text-2xl font-bold mt-2 opacity-90">{businessName}</p>
                <p className="opacity-60 text-sm mt-1 uppercase tracking-widest">Guam</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl"
              style={{ backgroundColor: colorPalette.accent, opacity: 0.3 }}
            />
          </div>

          {/* Text content */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] mb-3 block" style={{ color: colorPalette.accent }}>
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">
              About {businessName}
            </h2>
            <div className="space-y-5">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-gray-600 text-lg leading-relaxed">{p}</p>
              ))}
            </div>
            <div className="mt-10">
              <a href="#contact"
                className="inline-flex items-center gap-2 font-bold text-white px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: colorPalette.primary }}
              >
                Get in Touch →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
